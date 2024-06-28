export default function TextArea({ name, value, onChange, placeholder, rows }) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows ? rows : 3}
      className="mt-4 textarea text-base w-full bg-gray-50 text-black border border-sky-400 focus:border-sky-300 focus:border-2"
    ></textarea>
  );
}
