import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  AlertTriangle, 
  CheckCircle, 
  Copy, 
  Trash2, 
  Filter,
  RefreshCw,
  Download
} from 'lucide-react';
import { DataSet } from '@/types/data';
import { DataProcessor } from '@/utils/dataProcessing';

interface DataPreviewProps {
  dataSet: DataSet;
  onDataCleaned: (cleanedDataSet: DataSet) => void;
  onDataRemoved: () => void;
}

export const DataPreview = ({ dataSet, onDataCleaned, onDataRemoved }: DataPreviewProps) => {
  const { toast } = useToast();
  const [cleaningOptions, setCleaningOptions] = useState({
    removeDuplicates: false,
    fillMissingValues: false,
    removeOutliers: false,
    fillValue: 'N/A'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleCleanData = async () => {
    setIsProcessing(true);
    
    try {
      const cleanedDataSet = DataProcessor.cleanData(dataSet, cleaningOptions);
      
      setTimeout(() => {
        onDataCleaned(cleanedDataSet);
        toast({
          title: "Data cleaned successfully",
          description: `${cleanedDataSet.rowCount} rows remaining after cleaning`,
        });
        setIsProcessing(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error cleaning data",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const toggleRowSelection = (index: number) => {
    setSelectedRows(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getSeverityColor = (type: string) => {
    switch (type) {
      case 'missing': return 'bg-warning/10 text-warning border-warning/20';
      case 'duplicate': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'outlier': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const exportData = () => {
    const csvContent = [
      dataSet.columns.join(','),
      ...dataSet.data.map(row => 
        dataSet.columns.map(col => 
          typeof row[col] === 'string' && row[col].includes(',') 
            ? `"${row[col]}"` 
            : row[col]
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataSet.name}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Dataset Overview */}
      <Card className="border-glass bg-glass backdrop-blur-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {dataSet.hasIssues ? (
                <AlertTriangle className="h-5 w-5 text-warning" />
              ) : (
                <CheckCircle className="h-5 w-5 text-success" />
              )}
              {dataSet.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{dataSet.source}</Badge>
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={onDataRemoved}>
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>{dataSet.rowCount} rows</span>
            <span>{dataSet.columnCount} columns</span>
            <span>Uploaded {dataSet.uploadedAt.toLocaleDateString()}</span>
            {dataSet.hasIssues && (
              <Badge variant="secondary" className="bg-warning/20 text-warning">
                {dataSet.issues?.length} issues detected
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="preview" className="space-y-4">
        <TabsList className="bg-glass border-glass">
          <TabsTrigger value="preview">Data Preview</TabsTrigger>
          <TabsTrigger value="issues">Issues ({dataSet.issues?.length || 0})</TabsTrigger>
          <TabsTrigger value="cleaning">Data Cleaning</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <Card className="border-glass bg-glass backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Copy className="h-5 w-5" />
                Data Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedRows.length === dataSet.data.length}
                          onCheckedChange={(checked) => {
                            setSelectedRows(checked ? dataSet.data.map((_, i) => i) : []);
                          }}
                        />
                      </TableHead>
                      {dataSet.columns.map((column, index) => (
                        <TableHead key={index} className="min-w-32">
                          {column}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataSet.data.slice(0, 100).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.includes(index)}
                            onCheckedChange={() => toggleRowSelection(index)}
                          />
                        </TableCell>
                        {dataSet.columns.map((column, colIndex) => (
                          <TableCell key={colIndex} className="max-w-48 truncate">
                            {row[column]?.toString() || '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              {dataSet.data.length > 100 && (
                <p className="text-sm text-muted-foreground mt-4">
                  Showing first 100 rows of {dataSet.rowCount} total rows
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues">
          <Card className="border-glass bg-glass backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Data Quality Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dataSet.issues && dataSet.issues.length > 0 ? (
                <div className="space-y-3">
                  {dataSet.issues.map((issue, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${getSeverityColor(issue.type)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium capitalize">{issue.type}</p>
                          <p className="text-sm">{issue.description}</p>
                          {issue.rowIndex !== undefined && (
                            <p className="text-xs mt-1">
                              Row {issue.rowIndex + 1}
                              {issue.columnName && `, Column: ${issue.columnName}`}
                              {issue.value !== undefined && `, Value: ${issue.value}`}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {issue.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                  <p className="text-lg font-medium">No issues detected</p>
                  <p className="text-muted-foreground">Your data looks clean and ready for analysis!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cleaning">
          <Card className="border-glass bg-glass backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Data Cleaning Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="removeDuplicates"
                    checked={cleaningOptions.removeDuplicates}
                    onCheckedChange={(checked) => 
                      setCleaningOptions(prev => ({ ...prev, removeDuplicates: !!checked }))
                    }
                  />
                  <label htmlFor="removeDuplicates" className="text-sm font-medium">
                    Remove duplicate rows
                  </label>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fillMissing"
                      checked={cleaningOptions.fillMissingValues}
                      onCheckedChange={(checked) => 
                        setCleaningOptions(prev => ({ ...prev, fillMissingValues: !!checked }))
                      }
                    />
                    <label htmlFor="fillMissing" className="text-sm font-medium">
                      Fill missing values
                    </label>
                  </div>
                  {cleaningOptions.fillMissingValues && (
                    <div className="ml-6">
                      <Input
                        placeholder="Fill value (e.g., N/A, 0, Unknown)"
                        value={cleaningOptions.fillValue}
                        onChange={(e) => 
                          setCleaningOptions(prev => ({ ...prev, fillValue: e.target.value }))
                        }
                        className="max-w-xs"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="removeOutliers"
                    checked={cleaningOptions.removeOutliers}
                    onCheckedChange={(checked) => 
                      setCleaningOptions(prev => ({ ...prev, removeOutliers: !!checked }))
                    }
                  />
                  <label htmlFor="removeOutliers" className="text-sm font-medium">
                    Remove statistical outliers (Z-score &gt; 3)
                  </label>
                </div>
              </div>

              <Button 
                onClick={handleCleanData}
                disabled={isProcessing || (!cleaningOptions.removeDuplicates && !cleaningOptions.fillMissingValues && !cleaningOptions.removeOutliers)}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clean Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};