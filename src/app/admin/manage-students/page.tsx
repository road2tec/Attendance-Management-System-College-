"use client";
import { useEffect, useState } from "react";
import { api, endpoints } from "@/lib/api";
import SectionTitle from "@/components/SectionTitle";
import { IconPlus, IconTrash, IconSearch, IconPencil } from "@tabler/icons-react";
import Image from "next/image";

import Webcam from "react-webcam";
import { useRef } from "react";

export default function ManageStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Webcam &  Capture State
  const webcamRef = useRef<Webcam>(null);
  const [captures, setCaptures] = useState<string[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    department: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get(endpoints.students.getAll);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(endpoints.students.delete(id));
      fetchStudents();
      alert("Deleted successfully");
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleEdit = (student: any) => {
    setFormData({
      name: student.name,
      rollNo: student.rollNo,
      department: student.department || "",
      email: student.email,
      phone: student.phone
    });
    setCaptures([]); // Reset captures, optionally could load exist profile image
    setEditingId(student.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({ name: "", rollNo: "", department: "", email: "", phone: "" });
    setCaptures([]);
    setIsEditMode(false);
    setEditingId(null);
    setIsModalOpen(true);
  }

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCaptures(prev => [...prev, imageSrc]);
      }
    }
  };

  const clearCaptures = () => {
    setCaptures([]);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!isEditMode && captures.length < 1) return alert("Please capture at least 1 photo for new students");

    setLoading(true);

    try {
      if (isEditMode && editingId) {
        // Update Logic
        const payload: any = { ...formData };
        // Only send images if new ones are captured (optional logic, mostly we just update text fields)
        // For now, let's keep it simple: strict text update for edits, unless re-registering

        await api.put(endpoints.students.update(editingId), payload);
        alert("Student Updated Successfully!");
      } else {
        // Add Logic
        const payload = { ...formData, images: captures };
        await api.post(endpoints.students.add, payload);
        alert("Student Added Successfully!");
      }

      setIsModalOpen(false);
      setFormData({ name: "", rollNo: "", department: "", email: "", phone: "" });
      setCaptures([]);
      fetchStudents();

    } catch (err: any) {
      alert(err.response?.data?.detail || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <SectionTitle title="Manage Students" />
        <button
          onClick={openAddModal}
          className="btn btn-primary bg-teal-600 border-none hover:bg-teal-700 text-white gap-2"
        >
          <IconPlus size={20} /> Add Student
        </button>
      </div>

      <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-lg">
            {/* head */}
            <thead className="bg-base-200/50 text-gray-600">
              <tr>
                <th>Profile</th>
                <th>Name / Roll No</th>
                <th>Department</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-base-50 transition-colors">
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12 bg-gray-100">
                        {student.profileImage ? (
                          <img
                            src={`http://localhost:8001${student.profileImage}`}
                            alt={student.name}
                            onError={(e) => (e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + student.name)}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs">{student.name[0]}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-bold text-gray-800">{student.name}</div>
                    <div className="text-sm opacity-50">{student.rollNo}</div>
                  </td>
                  <td>
                    <span className="badge badge-ghost badge-sm">{student.department}</span>
                  </td>
                  <td>
                    <div className="text-sm">{student.email}</div>
                    <div className="text-xs opacity-50">{student.phone}</div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="btn btn-ghost btn-sm text-info"
                      >
                        <IconPencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="btn btn-ghost btn-sm text-error"
                      >
                        <IconTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">No students found. Add one to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-10">
          <div className="card w-full max-w-2xl bg-white shadow-2xl">
            <form onSubmit={handleSubmit} className="card-body">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                {isEditMode ? "Edit Student Details" : "Add New Student"}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase text-gray-500">Full Name</label>
                  <input required type="text" placeholder="John Doe" className="input input-bordered w-full"
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase text-gray-500">Roll No</label>
                  <input required type="text" placeholder="CS-2024-01" className="input input-bordered w-full"
                    value={formData.rollNo} onChange={e => setFormData({ ...formData, rollNo: e.target.value })} />
                </div>
              </div>

              <div className="form-control">
                <label className="label text-xs font-semibold uppercase text-gray-500">Department</label>
                <select className="select select-bordered w-full"
                  value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} >
                  <option disabled value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Tech">Information Tech</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase text-gray-500">Email</label>
                  <input required type="email" placeholder="john@example.com" className="input input-bordered w-full"
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase text-gray-500">Phone</label>
                  <input required type="text" placeholder="9876543210" className="input input-bordered w-full"
                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>

              {/* Camera Section (Only show for Add Mode or explicit Request) */}
              {!isEditMode && (
                <div className="form-control mt-4">
                  <label className="label text-xs font-semibold uppercase text-gray-500">Face Registration (Capture 4-5 Samples)</label>

                  <div className="border border-gra-200 rounded-lg p-4 bg-gray-50 text-center">
                    {isCameraOpen ? (
                      <>
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          screenshotQuality={0.8}
                          className="w-full rounded-lg mb-4"
                          videoConstraints={{ facingMode: "user" }}
                        />
                        <div className="flex justify-center gap-2">
                          <button type="button" onClick={capture} className="btn btn-secondary btn-sm">
                            <IconSearch size={16} /> Capture ({captures.length})
                          </button>
                          <button type="button" onClick={() => setIsCameraOpen(false)} className="btn btn-ghost btn-sm">
                            Close Camera
                          </button>
                        </div>
                      </>
                    ) : (
                      <button type="button" onClick={() => setIsCameraOpen(true)} className="btn btn-outline btn-block">
                        <IconSearch size={20} /> Open Camera to Register Face
                      </button>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {captures.length > 0 && (
                    <div className="mt-4">
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {captures.map((img, idx) => (
                          <div key={idx} className="relative w-16 h-16 flex-shrink-0">
                            <img src={img} className="w-full h-full object-cover rounded-lg border border-gray-300" />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">{captures.length} samples captured</span>
                        <button type="button" onClick={clearCaptures} className="btn btn-xs btn-error btn-outline">Clear All</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="card-actions justify-end mt-6">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" disabled={loading} className="btn btn-primary bg-teal-600 text-white">
                  {loading ? <span className="loading loading-spinner"></span> : (isEditMode ? "Update Student" : "Save Student")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
