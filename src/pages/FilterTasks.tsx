import { useState } from "react";

interface FilterTaskProps {
  onFilter: (filters: { category: string; tag: string; startDate: string; endDate: string }) => void;
}

const FilterTask: React.FC<FilterTaskProps> = ({ onFilter }) => {
  const [category, setCategory] = useState<string>("All");
  const [tag, setTag] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleFilter = () => {
    onFilter({ category, tag, startDate, endDate });
  };

  return (
    <div className="filter-container">
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="All">All</option>
        <option value="Personal">Personal</option>
        <option value="Work">Work</option>
      </select>

      <input
        type="text"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        placeholder="Search by tag"
      />

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <button onClick={handleFilter}>Apply Filters</button>
    </div>
  );
};

export default FilterTask;
