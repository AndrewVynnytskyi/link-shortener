import Form from "@/app/components/Form";
import { UrlShortSectionProps } from "@/app/types/types";





export default function UrlShortSection({urlFormComponents ,form , sectionText}: UrlShortSectionProps) {


  return (
    <section
      className={"w-[750px] rounded-md bg-white p-2 shadow-xl shadow-gray-200"}
    >
      <h2 className={"m-2 mb-0 text-center text-3xl font-bold text-gray-500"}>
        {sectionText}
      </h2>
      <Form
        className={{
          formClassName: "flex flex-row items-center justify-center",
          submitButtonClassName: "rounded-r-md",
        }}
        formComponents={urlFormComponents}
        form={form}
        submitButtonText={"Shorten Url"}
      />
    </section>
  );
}
