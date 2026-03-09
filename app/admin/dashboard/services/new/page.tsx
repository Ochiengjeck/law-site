import ServiceForm from "@/components/admin/ServiceForm";

export default function NewServicePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">New Service</h1>
        <p className="text-gray-500 text-sm mt-1">Add a new practice area</p>
      </div>
      <ServiceForm />
    </div>
  );
}
