import './index.css';
import React from 'react';
import PageView from '../../components/PageView';

const PresidentPage: React.FC = () => {
  return (
    <PageView
      title="Presidential Elections"
      type="president"
    />
  );
};

export default PresidentPage;
