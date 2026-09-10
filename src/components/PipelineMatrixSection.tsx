export interface WorkflowStep {
  id: number;
  name: string;
  status: 'completed' | 'active' | 'pending' | 'running' | 'failed';
}

export const PipelineMatrixSection = () => null;
