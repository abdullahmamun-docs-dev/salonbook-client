
"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Edit3,
  ImagePlus,
  Loader2,
  Plus,
  Scissors,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role?: "customer" | "admin";
  blocked?: boolean;
};

type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
  createdAt?: string;
};

type ServiceForm = {
  serviceName: string;
  category: string;
  description: string;
  price: string;
  duration: string;
  image: string;
};

const emptyForm: ServiceForm = {
  serviceName: "",
  category: "",
  description: "",
  price: "",
  duration: "",
  image: "",
};

const categories = [
  "Hair",
  "Skin",
  "Nails",
  "Makeup",
  "Spa",
  "Bridal",
];

export default function ManageServicesPage() {
  const router = useRouter();

  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const user = session?.user as AdminUser | undefined;
  const userRole = user?.role ?? null;

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] =
    useState<Service | null>(null);

  const [form, setForm] =
    useState<ServiceForm>(emptyForm);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  /*
    Load Services
  */
  const loadServices = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/services/admin/all",
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load services"
        );
      }

      setServices(data);
    } catch (error) {
      console.error("Load services error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load services"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
    Authentication Check
  */
  useEffect(() => {
    if (sessionLoading) {
      return;
    }

    if (!session?.user) {
      router.push("/signin");
      return;
    }

    if (userRole !== "admin") {
      router.push("/dashboard");
      return;
    }

    let cancelled = false;

    const fetchServices = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/services/admin/all",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load services"
          );
        }

        if (!cancelled) {
          setServices(data);
        }
      } catch (error) {
        console.error("Load services error:", error);

        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load services"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchServices();

    return () => {
      cancelled = true;
    };
  }, [sessionLoading, session, userRole, router]);

  const openAddForm = () => {
    setEditingService(null);
    setForm(emptyForm);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setShowForm(true);
  };

  const openEditForm = (service: Service) => {
    setEditingService(service);

    setForm({
      serviceName: service.serviceName,
      category: service.category,
      description: service.description,
      price: String(service.price),
      duration: String(service.duration),
      image: service.image,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setShowForm(true);
  };

  const closeForm = () => {
    if (saving || uploading) {
      return;
    }

    setShowForm(false);
    setEditingService(null);
    setForm(emptyForm);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (
    field: keyof ServiceForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /*
    Upload Image to ImgBB
  */
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("image", file);

      const response = await fetch(
        "http://localhost:5000/api/upload/image",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to upload image"
        );
      }

      setForm((previous) => ({
        ...previous,
        image: data.imageUrl,
      }));

      toast.success("Image uploaded successfully.");
    } catch (error) {
      console.error("Image upload error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload image"
      );
    } finally {
      setUploading(false);
    }
  };

  /*
    Create / Update Service
  */
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !form.serviceName.trim() ||
      !form.category.trim() ||
      !form.description.trim() ||
      !form.price ||
      !form.duration ||
      !form.image.trim()
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (
      Number(form.price) <= 0 ||
      Number(form.duration) <= 0
    ) {
      toast.error(
        "Price and duration must be greater than zero."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        serviceName: form.serviceName.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        duration: Number(form.duration),
        image: form.image.trim(),
        ...(editingService
          ? { status: editingService.status }
          : {}),
      };

      const url = editingService
        ? `http://localhost:5000/api/services/${editingService._id}`
        : "http://localhost:5000/api/services";

      const response = await fetch(url, {
        method: editingService ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save service"
        );
      }

      toast.success(
        editingService
          ? "Service updated successfully."
          : "Service created successfully."
      );

      setShowForm(false);
      setEditingService(null);
      setForm(emptyForm);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await loadServices();
    } catch (error) {
      console.error("Save service error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save service"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
    Activate / Deactivate
  */
  const toggleStatus = async (service: Service) => {
    try {
      const newStatus =
        service.status === "active"
          ? "inactive"
          : "active";

      const response = await fetch(
        `http://localhost:5000/api/services/${service._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update service status"
        );
      }

      toast.success(
        `Service ${
          newStatus === "active"
            ? "activated"
            : "deactivated"
        } successfully.`
      );

      await loadServices();
    } catch (error) {
      console.error("Toggle status error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update service status"
      );
    }
  };

  /*
    Delete Service
  */
  const deleteService = async (service: Service) => {
    toast("Delete this service?", {
      description: `Are you sure you want to delete "${service.serviceName}"?`,

      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const response = await fetch(
              `http://localhost:5000/api/services/${service._id}`,
              {
                method: "DELETE",
                credentials: "include",
              }
            );

            const data = await response.json();

            if (!response.ok) {
              throw new Error(
                data.message ||
                  "Failed to delete service"
              );
            }

            toast.success(
              "Service deleted successfully."
            );

            await loadServices();
          } catch (error) {
            console.error(
              "Delete service error:",
              error
            );

            toast.error(
              error instanceof Error
                ? error.message
                : "Failed to delete service"
            );
          }
        },
      },

      cancel: {
        label: "Keep Service",
        onClick: () => {},
      },
    });
  };

  if (sessionLoading || loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loader" />
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <div className="manage-services-page">
      {/* Header */}

      <header className="manage-services-header">
        <div className="manage-services-header-left">
          <Link
            href="/admin"
            className="manage-back-link"
          >
            <ArrowLeft size={17} />
            Dashboard
          </Link>

          <div className="manage-page-title">
            <div className="manage-title-icon">
              <Scissors size={22} />
            </div>

            <div>
              <span>SALONBOOK ADMINISTRATION</span>
              <h1>Manage Services</h1>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="manage-add-button"
          onClick={openAddForm}
        >
          <Plus size={17} />
          Add Service
        </button>
      </header>

      <main className="manage-services-content">
        {/* Overview */}

        <section className="manage-overview">
          <div>
            <span>YOUR SERVICES</span>

            <h2>
              {services.length} Services
            </h2>

            <p>
              Create and manage everything your salon
              offers.
            </p>
          </div>

          <div className="manage-overview-stats">
            <div>
              <strong>
                {
                  services.filter(
                    (service) =>
                      service.status === "active"
                  ).length
                }
              </strong>

              <span>Active</span>
            </div>

            <div>
              <strong>
                {
                  services.filter(
                    (service) =>
                      service.status === "inactive"
                  ).length
                }
              </strong>

              <span>Inactive</span>
            </div>
          </div>
        </section>

        {/* Services */}

        <section className="manage-services-section">
          {services.length === 0 ? (
            <div className="manage-empty">
              <div className="manage-empty-icon">
                <ImagePlus size={29} />
              </div>

              <h2>No services found</h2>

              <p>
                Start by adding your first salon
                service.
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="manage-add-button"
              >
                <Plus size={16} />
                Add First Service
              </button>
            </div>
          ) : (
            <div className="manage-services-grid">
              {services.map((service) => (
                <article
                  key={service._id}
                  className={`manage-service-card ${
                    service.status === "inactive"
                      ? "service-inactive"
                      : ""
                  }`}
                >
                  <div className="manage-service-image">
                    <img
                      src={service.image}
                      alt={service.serviceName}
                    />

                    <span
                      className={`manage-service-status ${
                        service.status
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>

                  <div className="manage-service-body">
                    <div className="manage-service-category">
                      {service.category}
                    </div>

                    <h3>{service.serviceName}</h3>

                    <p>{service.description}</p>

                    <div className="manage-service-info">
                      <strong>
                        ৳{service.price}
                      </strong>

                      <span>
                        {service.duration} min
                      </span>
                    </div>

                    <div className="manage-service-actions">
                      <button
                        type="button"
                        className="manage-edit-button"
                        onClick={() =>
                          openEditForm(service)
                        }
                      >
                        <Edit3 size={15} />
                        Edit
                      </button>

                      <button
                        type="button"
                        className={`manage-status-button ${
                          service.status
                        }`}
                        onClick={() =>
                          toggleStatus(service)
                        }
                      >
                        {service.status === "active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button
                        type="button"
                        className="manage-delete-button"
                        onClick={() =>
                          deleteService(service)
                        }
                        aria-label="Delete service"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Add/Edit Modal */}

      {showForm && (
        <div className="service-modal-overlay">
          <div className="service-modal">
            <div className="service-modal-header">
              <div>
                <span>
                  {editingService
                    ? "UPDATE SERVICE"
                    : "NEW SERVICE"}
                </span>

                <h2>
                  {editingService
                    ? "Edit Service"
                    : "Add New Service"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="service-modal-close"
                disabled={saving || uploading}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="service-form"
            >
              <div className="service-form-grid">
                <div className="service-form-field">
                  <label>Service Name</label>

                  <input
                    type="text"
                    value={form.serviceName}
                    onChange={(event) =>
                      handleInputChange(
                        "serviceName",
                        event.target.value
                      )
                    }
                    placeholder="e.g. Premium Haircut"
                  />
                </div>

                <div className="service-form-field">
                  <label>Category</label>

                  <select
                    value={form.category}
                    onChange={(event) =>
                      handleInputChange(
                        "category",
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="service-form-field">
                <label>Description</label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    handleInputChange(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Describe the service..."
                  rows={4}
                />
              </div>

              <div className="service-form-grid">
                <div className="service-form-field">
                  <label>Price (BDT)</label>

                  <input
                    type="number"
                    min="1"
                    value={form.price}
                    onChange={(event) =>
                      handleInputChange(
                        "price",
                        event.target.value
                      )
                    }
                    placeholder="1500"
                  />
                </div>

                <div className="service-form-field">
                  <label>
                    Duration (minutes)
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={form.duration}
                    onChange={(event) =>
                      handleInputChange(
                        "duration",
                        event.target.value
                      )
                    }
                    placeholder="60"
                  />
                </div>
              </div>

              {/* Image Upload */}

              <div className="service-form-field">
                <label>Service Image</label>

                <div className="service-upload-row">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading || saving}
                    className="service-file-input"
                  />

                  <button
                    type="button"
                    className="service-upload-button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={uploading || saving}
                  >
                    {uploading ? (
                      <>
                        <Loader2
                          size={16}
                          className="spin"
                        />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Choose Image
                      </>
                    )}
                  </button>
                </div>

                <small>
                  JPG, PNG, WEBP or other image files.
                  Maximum size 5MB.
                </small>
              </div>

              {/* Image URL */}

              <div className="service-form-field">
                <label>Image URL</label>

                <div className="image-url-input">
                  <ImagePlus size={17} />

                  <input
                    type="url"
                    value={form.image}
                    onChange={(event) =>
                      handleInputChange(
                        "image",
                        event.target.value
                      )
                    }
                    placeholder="Uploaded image URL will appear here"
                  />
                </div>

                <small>
                  You can upload an image above or
                  manually enter an image URL.
                </small>
              </div>

              {/* Preview */}

              {form.image && (
                <div className="service-image-preview">
                  <img
                    src={form.image}
                    alt="Service preview"
                  />

                  <span>Image Preview</span>
                </div>
              )}

              <div className="service-form-actions">
                <button
                  type="button"
                  className="service-cancel-button"
                  onClick={closeForm}
                  disabled={saving || uploading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="service-save-button"
                  disabled={
                    saving ||
                    uploading ||
                    !form.image.trim()
                  }
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={16}
                        className="spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={16} />

                      {editingService
                        ? "Update Service"
                        : "Create Service"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
