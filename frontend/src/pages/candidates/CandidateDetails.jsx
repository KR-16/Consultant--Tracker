import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import Layout from '../../components/layout/Layout';

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/candidates')}>&larr; Back to List</Button>
      </div>

      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Candidate Profile: {id}</h1>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-slate-500">Email</h3>
                <p>candidate@example.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-500">Phone</h3>
                <p>+1 (555) 000-0000</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-500">Skills</h3>
                <div className="flex gap-2 mt-1">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">React</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Python</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default CandidateDetails;