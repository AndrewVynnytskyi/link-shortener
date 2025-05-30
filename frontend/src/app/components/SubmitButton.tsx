export default function SubmitButton({ text }: { text: string }) {
  return (
    <button
      className={
        "h-14 rounded-r-md bg-blue-500 p-2 text-center text-white shadow-md shadow-blue-500 transition-shadow hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600"
      }
      type={"submit"}
    >
      {text}
    </button>
  );
}
