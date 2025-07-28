import { DataRow, DataSet, DataIssue } from '@/types/data';

export class DataProcessor {
  static analyzeData(data: DataRow[], name: string, source: DataSet['source']): DataSet {
    const columns = data.length > 0 ? Object.keys(data[0]) : [];
    const issues = this.detectIssues(data, columns);
    
    return {
      id: crypto.randomUUID(),
      name,
      data,
      columns,
      source,
      uploadedAt: new Date(),
      rowCount: data.length,
      columnCount: columns.length,
      hasIssues: issues.length > 0,
      issues
    };
  }

  static detectIssues(data: DataRow[], columns: string[]): DataIssue[] {
    const issues: DataIssue[] = [];
    
    // Check for missing values
    data.forEach((row, index) => {
      columns.forEach(column => {
        const value = row[column];
        if (value === null || value === undefined || value === '') {
          issues.push({
            type: 'missing',
            description: `Missing value in column "${column}"`,
            rowIndex: index,
            columnName: column
          });
        }
      });
    });

    // Check for duplicates
    const seen = new Set();
    data.forEach((row, index) => {
      const rowString = JSON.stringify(row);
      if (seen.has(rowString)) {
        issues.push({
          type: 'duplicate',
          description: `Duplicate row detected`,
          rowIndex: index
        });
      }
      seen.add(rowString);
    });

    // Check for numerical outliers using Z-score
    columns.forEach(column => {
      const numericalValues = data
        .map(row => parseFloat(row[column]))
        .filter(val => !isNaN(val));
      
      if (numericalValues.length > 10) { // Only check if we have enough data
        const mean = numericalValues.reduce((a, b) => a + b, 0) / numericalValues.length;
        const std = Math.sqrt(
          numericalValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericalValues.length
        );
        
        data.forEach((row, index) => {
          const value = parseFloat(row[column]);
          if (!isNaN(value) && Math.abs(value - mean) > 3 * std) {
            issues.push({
              type: 'outlier',
              description: `Potential outlier in column "${column}"`,
              rowIndex: index,
              columnName: column,
              value
            });
          }
        });
      }
    });

    return issues;
  }

  static cleanData(dataSet: DataSet, cleaningOptions: {
    removeDuplicates?: boolean;
    fillMissingValues?: boolean;
    removeOutliers?: boolean;
    fillValue?: string;
  }): DataSet {
    let cleanedData = [...dataSet.data];

    if (cleaningOptions.removeDuplicates) {
      const seen = new Set();
      cleanedData = cleanedData.filter(row => {
        const rowString = JSON.stringify(row);
        if (seen.has(rowString)) {
          return false;
        }
        seen.add(rowString);
        return true;
      });
    }

    if (cleaningOptions.fillMissingValues) {
      const fillValue = cleaningOptions.fillValue || 'N/A';
      cleanedData = cleanedData.map(row => {
        const cleanedRow = { ...row };
        dataSet.columns.forEach(column => {
          if (cleanedRow[column] === null || cleanedRow[column] === undefined || cleanedRow[column] === '') {
            cleanedRow[column] = fillValue;
          }
        });
        return cleanedRow;
      });
    }

    if (cleaningOptions.removeOutliers) {
      dataSet.columns.forEach(column => {
        const numericalValues = cleanedData
          .map(row => parseFloat(row[column]))
          .filter(val => !isNaN(val));
        
        if (numericalValues.length > 10) {
          const mean = numericalValues.reduce((a, b) => a + b, 0) / numericalValues.length;
          const std = Math.sqrt(
            numericalValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericalValues.length
          );
          
          cleanedData = cleanedData.filter(row => {
            const value = parseFloat(row[column]);
            return isNaN(value) || Math.abs(value - mean) <= 3 * std;
          });
        }
      });
    }

    return this.analyzeData(cleanedData, `${dataSet.name} (cleaned)`, dataSet.source);
  }
}