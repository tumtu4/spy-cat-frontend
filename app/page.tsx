"use client";

import { useEffect, useState } from "react";

type Cat = {
  id: number;
  name: string;
  years_of_experience: number;
  breed: string;
  salary: string;
};

export default function Home() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    years_of_experience: "",
    breed: "",
    salary: "",
  });

  const API_URL = "http://127.0.0.1:8000/api/cats/";

  const fetchCats = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCats(data);
    } catch {
      setError("Failed to load cats");
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          years_of_experience: Number(formData.years_of_experience),
          salary: Number(formData.salary),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(JSON.stringify(errData));
        return;
      }

      setFormData({
        name: "",
        years_of_experience: "",
        breed: "",
        salary: "",
      });

      fetchCats();
    } catch {
      setError("Failed to create cat");
    }
  };

  const deleteCat = async (id: number) => {
    await fetch(`${API_URL}${id}/`, {
      method: "DELETE",
    });
    fetchCats();
  };

  const updateSalary = async (id: number, newSalary: string) => {
    await fetch(`${API_URL}${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ salary: Number(newSalary) }),
    });
    fetchCats();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Spy Cats Dashboard</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="years_of_experience"
          placeholder="Years of Experience"
          value={formData.years_of_experience}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="breed"
          placeholder="Breed"
          value={formData.breed}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Cat
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* List */}
      <div className="space-y-4">
        {cats.map((cat) => (
          <div
            key={cat.id}
            className="border p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{cat.name}</p>
              <p>Breed: {cat.breed}</p>
              <p>Experience: {cat.years_of_experience} years</p>
              <p>Salary: ${cat.salary}</p>
            </div>

            <div className="space-y-2">
              <input
                type="number"
                placeholder="New Salary"
                className="border p-1"
                onBlur={(e) =>
                  updateSalary(cat.id, e.target.value)
                }
              />

              <button
                onClick={() => deleteCat(cat.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
