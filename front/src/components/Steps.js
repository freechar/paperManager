import { Progress, Steps } from 'antd';
import { useState } from 'react';

const { Step } = Steps;



const ProgressTracker = ({ steps, currentStep }) => {
    const [percent, setPercent] = useState(0);

    // 计算当前进度
    const currentStepIndex = steps.findIndex((step) => step === currentStep);

    return (
        <div>
            <Steps current={currentStepIndex}>
                {steps.map((step) => (
                    <Step key={step} title={step} />
                ))}
            </Steps>
        </div>
    );
};

export default ProgressTracker