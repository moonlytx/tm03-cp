import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';


const useWasteData = () => {
  const [wasteItems, setWasteItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState(() => {
    const savedCounts = localStorage.getItem('wasteCounts');
    return savedCounts ? JSON.parse(savedCounts) : {};
  });
  const [accumulatedWeights, setAccumulatedWeights] = useState(() => {
    const savedWeights = localStorage.getItem('accumulatedWeights');
    return savedWeights ? JSON.parse(savedWeights) : {};
  });
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || 'Anonymous');
  const [isEditing, setIsEditing] = useState(false);

  const [wastebinCollected, setwastebinCollected] = useState(() => {
    return parseInt(localStorage.getItem('wastebinCollected')) || 0;
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [totalWaste, setTotalWaste] = useState(() => {
    return parseFloat(localStorage.getItem('totalWaste') || '0');
  });
  const progressPercentage = Math.round((totalWaste / 60) * 100);
  const [totalAccumulatedWaste, setTotalAccumulatedWaste] = useState(() => {
    return parseFloat(localStorage.getItem('totalAccumulatedWaste') || '0');
  });
  const [totalCarbonEmission, setTotalCarbonEmission] = useState(() => {
    return parseFloat(localStorage.getItem('totalCarbonEmission') || '0');
  });

  // Fetch Data from API
  useEffect(() => {
    const fetchWasteItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://156.225.17.211:5000/api/items');
        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
        const data = await response.json();
        setWasteItems(data);
        initializeCounts(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch waste items:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchWasteItems();
  }, []);

  const initializeCounts = (items) => {
    setCounts(prev => {
      const newCounts = { ...prev };
      items.forEach(item => {
        if (newCounts[item.id] === undefined) newCounts[item.id] = 0;
      });
      return newCounts;
    });

    setAccumulatedWeights(prev => {
      const newWeights = { ...prev };
      items.forEach(item => {
        if (newWeights[item.id] === undefined) newWeights[item.id] = 0;
      });
      return newWeights;
    });
  };

  const incrementCount = (type) => {
    setCounts(prev => ({ ...prev, [type]: prev[type] + 1 }));
    setHasUnsavedChanges(true);
  };

  const decrementCount = (type) => {
    setCounts(prev => ({ ...prev, [type]: prev[type] > 0 ? prev[type] - 1 : 0 }));
    setHasUnsavedChanges(true);
  };

  const saveData = async () => {
    try {
      let newWeight = 0;
      let newCount = 0;
      let newCarbon = 0;

      wasteItems.forEach(item => {
        const count = Number(counts[item.id]) || 0;
        newCount += count;
        newWeight += count * item.kg_per_item;
        newCarbon += count * item.kg_co2_per_kg_item;
      });

      const totalWeightAfterSave = totalWaste + newWeight;
      const cycles = Math.floor(totalWeightAfterSave / 60);
      const updatedTotalWaste = totalWeightAfterSave % 60;
      const updatedwastebinCollected = wastebinCollected + cycles;
      const updatedTotalCarbonEmission = totalCarbonEmission + newCarbon;

      const updatedAccumulatedWeights = { ...accumulatedWeights };
      wasteItems.forEach(item => {
        const count = counts[item.id] || 0;
        updatedAccumulatedWeights[item.id] += count * item.kg_per_item;
      });

      const resetCounts = Object.keys(counts).reduce((acc, key) => {
        acc[key] = 0;
        return acc;
      }, {});
      const updatedTotalAccumulatedWaste = totalAccumulatedWaste + newWeight;

      localStorage.setItem('totalWaste', updatedTotalWaste.toString());
      localStorage.setItem('accumulatedWeights', JSON.stringify(updatedAccumulatedWeights));
      localStorage.setItem('wasteCounts', JSON.stringify(resetCounts));
      localStorage.setItem('wastebinCollected', updatedwastebinCollected.toString());
      localStorage.setItem('totalAccumulatedWaste', updatedTotalAccumulatedWaste.toString());
      localStorage.setItem('totalCarbonEmission', updatedTotalCarbonEmission.toString());

      setwastebinCollected(updatedwastebinCollected);
      setTotalWaste(updatedTotalWaste);
      setAccumulatedWeights(updatedAccumulatedWeights);
      setCounts(resetCounts);
      setHasUnsavedChanges(false);
      setTotalAccumulatedWaste(updatedTotalAccumulatedWaste);
      setTotalCarbonEmission(updatedTotalCarbonEmission);

      if (cycles > 0) {
        toast.success(`Awesome! You've planted ${cycles} new tree${cycles > 1 ? 's' : ''}! Progress: ${updatedTotalWaste.toFixed(1)}/60kg`);
      }
      toast.success(`Great job! You saved: ${newCount} item${newCount > 1 ? 's' : ''}, totaling ${newWeight.toFixed(2)}kg`);

    } catch (error) {
      totalAccumulatedWaste
      console.error('fail to save', error);
    }
  };


  const handleNameClick = () => setIsEditing(true);
  const handleNameSave = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      localStorage.setItem('userName', userName);
      setIsEditing(false);
    }
  };

  return {
    wasteItems,
    isLoading,
    error,
    userName,
    isEditing,
    totalWaste,
    progressPercentage,
    counts,
    accumulatedWeights,
    hasUnsavedChanges,
    wastebinCollected,
    totalAccumulatedWaste,
    totalCarbonEmission,
    handleNameClick,
    handleNameSave,
    setUserName,
    incrementCount,
    decrementCount,
    saveData
  };
};

export default useWasteData;