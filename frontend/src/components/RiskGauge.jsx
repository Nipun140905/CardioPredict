import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip);

const RiskGauge = ({ probability }) => {
    const color = probability < 30 ? '#16a34a' : probability < 60 ? '#d97706' : '#dc2626';
    const data = {
        datasets: [{
            data: [probability, 100 - probability],
            backgroundColor: [color, '#f1f5f9'],
            borderWidth: 0,
            circumference: 180,
            rotation: 270,
        }]
    };
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { tooltip: { enabled: false } },
        cutout: '75%',
    };

    return (
        <div className="text-center position-relative" style={{ maxWidth: '200px', margin: '0 auto' }}>
            <Doughnut data={data} options={options} />
            <div style={{
                position: 'absolute', bottom: '10px', left: '50%',
                transform: 'translateX(-50%)', textAlign: 'center'
            }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color, letterSpacing: '-0.5px' }}>
                    {probability}%
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Risk Score</div>
            </div>
        </div>
    );
};

export default RiskGauge;