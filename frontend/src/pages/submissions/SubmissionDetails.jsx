import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import Layout from '../../components/layout/Layout';

const SubmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Layout>
       <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/submissions')}>&larr; Back to Board</Button>
      </div>
      
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Submission #{id}</h2>
          <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium w-fit">
            Interview Scheduled
          </span>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">Details about the interview process, client feedback, and timeline go here.</p>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default SubmissionDetails;