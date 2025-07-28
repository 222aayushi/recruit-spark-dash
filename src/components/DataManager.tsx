import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Plus, FileText } from 'lucide-react';
import { DataSet } from '@/types/data';
import { DataUpload } from './DataUpload';
import { DataPreview } from './DataPreview';

export const DataManager = () => {
  const [dataSets, setDataSets] = useState<DataSet[]>([]);
  const [activeDataSet, setActiveDataSet] = useState<DataSet | null>(null);

  const handleDataUploaded = (dataSet: DataSet) => {
    setDataSets(prev => [...prev, dataSet]);
    setActiveDataSet(dataSet);
  };

  const handleDataCleaned = (cleanedDataSet: DataSet) => {
    setDataSets(prev => prev.map(ds => 
      ds.id === activeDataSet?.id ? cleanedDataSet : ds
    ));
    setActiveDataSet(cleanedDataSet);
  };

  const handleDataRemoved = () => {
    if (activeDataSet) {
      setDataSets(prev => prev.filter(ds => ds.id !== activeDataSet.id));
      setActiveDataSet(null);
    }
  };

  const selectDataSet = (dataSet: DataSet) => {
    setActiveDataSet(dataSet);
  };

  return (
    <div className="space-y-6">
      <Card className="border-glass bg-glass backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={dataSets.length === 0 ? "upload" : "datasets"} className="space-y-4">
            <TabsList className="bg-glass border-glass">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Upload Data
              </TabsTrigger>
              <TabsTrigger value="datasets" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Datasets ({dataSets.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <DataUpload onDataUploaded={handleDataUploaded} />
            </TabsContent>

            <TabsContent value="datasets">
              {dataSets.length === 0 ? (
                <div className="text-center py-12">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">No datasets uploaded yet</p>
                  <p className="text-muted-foreground">Upload your first dataset to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Dataset List */}
                  <div className="lg:col-span-1 space-y-3">
                    <h3 className="font-medium text-sm text-muted-foreground">Your Datasets</h3>
                    {dataSets.map((dataSet) => (
                      <Button
                        key={dataSet.id}
                        variant={activeDataSet?.id === dataSet.id ? "default" : "ghost"}
                        className="w-full justify-start h-auto p-4"
                        onClick={() => selectDataSet(dataSet)}
                      >
                        <div className="text-left">
                          <p className="font-medium">{dataSet.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {dataSet.rowCount} rows • {dataSet.source}
                          </p>
                        </div>
                      </Button>
                    ))}
                  </div>

                  {/* Dataset Preview */}
                  <div className="lg:col-span-2">
                    {activeDataSet ? (
                      <DataPreview
                        dataSet={activeDataSet}
                        onDataCleaned={handleDataCleaned}
                        onDataRemoved={handleDataRemoved}
                      />
                    ) : (
                      <Card className="border-glass bg-glass backdrop-blur-md">
                        <CardContent className="flex items-center justify-center h-64">
                          <p className="text-muted-foreground">Select a dataset to preview</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};