import PartnerForm from "@/components/admin/PartnerForm";

export default function NewPartnerPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">New Partner</h1>
        <p className="text-gray-500 text-sm mt-1">Add a new partner profile</p>
      </div>
      <PartnerForm />
    </div>
  );
}
