const FIELDS = [
    { key: 'age', label: 'Age', min: 1, max: 120, placeholder: 'e.g. 52', tip: 'Patient age in years (1–120)' },
    { key: 'trestbps', label: 'Resting Blood Pressure (mmHg)', min: 80, max: 200, placeholder: 'e.g. 130', tip: 'Resting blood pressure in mmHg (80–200)' },
    { key: 'chol', label: 'Cholesterol (mg/dl)', min: 100, max: 600, placeholder: 'e.g. 240', tip: 'Serum cholesterol in mg/dl (100–600)' },
    { key: 'thalach', label: 'Max Heart Rate (bpm)', min: 60, max: 220, placeholder: 'e.g. 150', tip: 'Maximum heart rate achieved during exercise (60–220)' },
    { key: 'oldpeak', label: 'ST Depression (Oldpeak)', min: 0, max: 10, step: 0.1, placeholder: 'e.g. 1.5', tip: 'ST depression induced by exercise relative to rest (0–10)' },
];

const DROPDOWNS = [
    {
        key: 'sex', label: 'Sex', tip: 'Biological sex of the patient',
        options: [{ value: 1, label: 'Male' }, { value: 0, label: 'Female' }]
    },
    {
        key: 'cp', label: 'Chest Pain Type', tip: 'Type of chest pain experienced',
        options: [{ value: 3, label: 'Asymptomatic' }, { value: 0, label: 'Typical Angina' },
        { value: 1, label: 'Atypical Angina' }, { value: 2, label: 'Non-anginal Pain' }]
    },
    {
        key: 'fbs', label: 'Fasting Blood Sugar > 120 mg/dl', tip: 'Is fasting blood sugar greater than 120 mg/dl?',
        options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }]
    },
    {
        key: 'restecg', label: 'Resting ECG', tip: 'Resting electrocardiographic results',
        options: [{ value: 0, label: 'Normal' }, { value: 1, label: 'ST-T Abnormality' }, { value: 2, label: 'LV Hypertrophy' }]
    },
    {
        key: 'exang', label: 'Exercise Induced Angina', tip: 'Does exercise cause chest pain?',
        options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }]
    },
    {
        key: 'slope', label: 'Slope of ST Segment', tip: 'Slope of the peak exercise ST segment',
        options: [{ value: 0, label: 'Upsloping' }, { value: 1, label: 'Flat' }, { value: 2, label: 'Downsloping' }]
    },
    {
        key: 'ca', label: 'Major Vessels (CA)', tip: 'Number of major vessels colored by fluoroscopy (0–3)',
        options: [{ value: 0, label: '0' }, { value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }]
    },
    {
        key: 'thal', label: 'Thalassemia', tip: 'Thalassemia type — blood disorder affecting hemoglobin',
        options: [{ value: 0, label: 'Normal' }, { value: 1, label: 'Fixed Defect' }, { value: 2, label: 'Reversible Defect' }]
    },
];

const Tooltip = ({ tip }) => (
    <span className="field-tooltip" data-tip={tip}>?</span>
);

const PatientForm = ({ form, errors, onChange }) => {
    return (
        <div className="row g-3">
            {FIELDS.map(field => (
                <div className="col-md-6" key={field.key}>
                    <label className="app-label">
                        {field.label} <Tooltip tip={field.tip} />
                    </label>
                    <input
                        type="number"
                        className={`app-input ${errors[field.key] ? 'is-invalid' : ''}`}
                        placeholder={field.placeholder}
                        min={field.min} max={field.max} step={field.step || 1}
                        value={form[field.key] === undefined ? '' : form[field.key]}
                        onChange={e => onChange(field.key, e.target.value)}
                    />
                    {errors[field.key] && <div className="invalid-msg">{errors[field.key]}</div>}
                </div>
            ))}
            {DROPDOWNS.map(field => (
                <div className="col-md-6" key={field.key}>
                    <label className="app-label">
                        {field.label} <Tooltip tip={field.tip} />
                    </label>
                    <select
                        className={`app-select ${errors[field.key] ? 'is-invalid' : ''}`}
                        value={form[field.key] === undefined ? '' : form[field.key]}
                        onChange={e => onChange(field.key, e.target.value)}>
                        <option value="">— Select —</option>
                        {field.options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    {errors[field.key] && <div className="invalid-msg">{errors[field.key]}</div>}
                </div>
            ))}
        </div>
    );
};

export default PatientForm;