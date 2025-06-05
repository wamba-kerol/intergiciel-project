import React from 'react';
import { FormEvent, ChangeEvent } from 'react';

interface StudentFormData {
  name: string;
  email: string;
  sex: string;
  age: number;
  address: string;
}

interface StudentFormProps {
  studentForm: StudentFormData;
  handleStudentChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleStudentSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({
  studentForm,
  handleStudentChange,
  handleStudentSubmit,
  onCancel
}) => {
  return (
    <form onSubmit={handleStudentSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
        <input
          type="text"
          id="name"
          name="name"
          value={studentForm.name}
          onChange={handleStudentChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={studentForm.email}
          onChange={handleStudentChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-md py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
          required
        />
      </div>



      <div>
        <label htmlFor="sex" className="block text-sm font-medium text-gray-700">Sexe</label>
        <select
          id="sex"
          name="sex"
          value={studentForm.sex}
          onChange={handleStudentChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
          required
        >
          <option value="">Sélectionnez</option>
          <option value="Masculin">Masculin</option>
          <option value="Féminin">Féminin</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">Âge</label>
        <input
          type="number"
          id="age"
          name="age"
          value={studentForm.age}
          onChange={handleStudentChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
          required
          min="5"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse</label>
        <input
          type="text"
          id="address"
          name="address"
          value={studentForm.address}
          onChange={handleStudentChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-800 focus:border-blue-800"
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
        >
          Ajouter
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
