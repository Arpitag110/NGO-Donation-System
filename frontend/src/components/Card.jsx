function Card({ title, children }) {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 w-full max-w-md shadow-lg">
      {title && (
        <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
      )}
      {children}
    </div>
  );
}

export default Card;
