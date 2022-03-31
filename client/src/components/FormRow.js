const FormRow = ({ type, name, value, labelText, onChange }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <input
        type={type}
        value={value}
        name={name}
        onChange={onChange}
        className="form-input"
      />
    </div>
  );
};
export default FormRow;
