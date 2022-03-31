const FormRowSelect = ({ name, label, value, onChange, options }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {label || name}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="form-select"
      >
        {options.map((item, index) => {
          return (
            <option key={index} value={item}>
              {item}
            </option>
          );
        })}
      </select>
    </div>
  );
};
export default FormRowSelect;
