export default function Input({
  label,
  type,
  name,
  value,
  placeholder,
  onChange,
  error,
  helperText,
  disabled,
}) {
  return (
    <label className="form-control w-full">
      {label ? (
        <div className="label">
          <span className="label-text text-black text-lg">{label}</span>
        </div>
      ) : null}
      <input
        type={type ? type : "text"}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        className="input input-bordered input-info w-full bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-200 disabled:placeholder:text-gray-300 disabled:border-gray-100"
      />
      {error ? (
        <div className="label">
          <span className="label-text-alt text-error">{helperText}</span>
        </div>
      ) : null}
    </label>
  );
}
