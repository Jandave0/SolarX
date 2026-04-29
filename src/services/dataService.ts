import { Paths, File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as Print from 'expo-print';
import { SQLiteDatabase } from 'expo-sqlite';
import { AssessmentRecord } from './database';
import { HardwareItem } from './hardwareService';

export const exportToJSON = async (db: SQLiteDatabase) => {
  try {
    const assessments = await db.getAllAsync<AssessmentRecord>('SELECT * FROM assessments');
    const hardware = await db.getAllAsync<HardwareItem>('SELECT * FROM hardware');

    const data = {
      assessments,
      hardware,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };

    // Use New API: Paths.cache and File class
    const backupFile = new File(Paths.cache, 'solarx_backup.json');
    await backupFile.write(JSON.stringify(data, null, 2));

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(backupFile.uri);
    }
  } catch (error) {
    console.error('Export Error:', error);
    throw error;
  }
};

export const importFromJSON = async (db: SQLiteDatabase) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    // Use New API: Read text from the picked file
    const pickedFile = new File(result.assets[0].uri);
    const content = await pickedFile.text();
    const data = JSON.parse(content);

    // Basic validation
    if (!data.assessments || !data.hardware) {
      throw new Error('Invalid backup file format.');
    }

    // Insert assessments
    for (const item of data.assessments) {
      await db.runAsync(
        'INSERT OR REPLACE INTO assessments (id, date, location, avg_usage, roof_area, recommendation) VALUES (?, ?, ?, ?, ?, ?)',
        [item.id, item.date, item.location, item.avg_usage, item.roof_area, item.recommendation]
      );
    }

    // Insert hardware
    for (const item of data.hardware) {
      await db.runAsync(
        'INSERT OR REPLACE INTO hardware (id, name, type, status, health, specs, price) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [item.id, item.name, item.type, item.status, item.health, item.specs, item.price]
      );
    }

    return true;
  } catch (error) {
    console.error('Import Error:', error);
    throw error;
  }
};

export const generatePDFReport = async (db: SQLiteDatabase) => {
  try {
    const assessments = await db.getAllAsync<AssessmentRecord>('SELECT * FROM assessments LIMIT 10');
    
    let htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
            h1 { color: #FFB703; border-bottom: 2px solid #FFB703; padding-bottom: 10px; }
            .card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
            .date { color: #888; font-size: 12px; }
            .recommendation { background: #f9f9f9; padding: 10px; border-radius: 4px; font-size: 14px; margin-top: 10px; }
            .footer { margin-top: 50px; font-size: 10px; color: #aaa; text-align: center; }
          </style>
        </head>
        <body>
          <h1>SolarX Intelligence Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
          
          ${assessments.map(a => `
            <div class="card">
              <div class="date">${new Date(a.date).toLocaleString()}</div>
              <h3>Assessment: ${a.location || 'Unknown Location'}</h3>
              <p>Monthly Consumption: <strong>${a.avg_usage} kWh</strong></p>
              <div class="recommendation">
                ${a.recommendation.replace(/\n/g, '<br/>')}
              </div>
            </div>
          `).join('')}
          
          <div class="footer">
            SolarX AI Monitoring System — Optimized for Philippine Efficiency.
          </div>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    
    // Use New API to handle the generated PDF
    const pdfFile = new File(uri);
    
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfFile.uri);
    }
  } catch (error) {
    console.error('PDF Error:', error);
    throw error;
  }
};
