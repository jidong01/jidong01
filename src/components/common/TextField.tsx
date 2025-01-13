interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: 'text' | 'password';
  className?: string;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-semibold text-sm leading-6 tracking-[-0.2px] text-gray-800">
        {label}
      </label>
      <div className="flex flex-row items-center px-3 py-2 w-full h-9 bg-[#F7F8F9] rounded-lg">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-sm leading-5 tracking-[-0.2px] text-gray-900 bg-transparent outline-none placeholder:text-gray-400"
        />
        {type === 'password' && (
          <button className="w-[14px] h-[14px] text-gray-200">
            {/* TODO: 비밀번호 보기/숨기기 아이콘 */}
          </button>
        )}
      </div>
    </div>
  );
} 