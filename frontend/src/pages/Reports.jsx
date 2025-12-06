import React from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent } from '../components/ui/card';

const Reports = () => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Reports & Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">Submission Funnel</h3>
            <div className="h-40 bg-slate-100 rounded flex items-center justify-center text-slate-400">
              Bar Chart Placeholder
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">Placement Rate</h3>
            <div className="h-40 bg-slate-100 rounded flex items-center justify-center text-slate-400">
              Pie Chart Placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;