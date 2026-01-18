function Button({ text, type = "submit" }) {
  return (
    <button
      type={type}
      className="w-full bg-red-600 text-white py-2 rounded-md font-medium
                 hover:bg-red-700 transition duration-200"
    >
      {text}
    </button>
  );
}

export default Button;
