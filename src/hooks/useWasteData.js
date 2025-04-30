import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { exportDataAsDB, importDataFromDB } from '../services/dataService';

const useWasteData = () => {
  // All state hooks must be called unconditionally at the top level
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
  const [totalCount, setTotalCount] = useState(() => {
    return parseInt(localStorage.getItem('totalCount') || '0');
  });
  const [wastebinCollected, setWastebinCollected] = useState(() => {
    return parseInt(localStorage.getItem('wastebinCollected')) || 0;
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [totalWaste, setTotalWaste] = useState(() => {
    return parseFloat(localStorage.getItem('totalWaste') || '0');
  });
  const [totalAccumulatedWaste, setTotalAccumulatedWaste] = useState(() => {
    return parseFloat(localStorage.getItem('totalAccumulatedWaste') || '0');
  });
  const [totalCarbonEmission, setTotalCarbonEmission] = useState(() => {
    return parseFloat(localStorage.getItem('totalCarbonEmission') || '0');
  });
  // New state for community carbon emission
  const [communityCarbonEmission, setCommunityCarbonEmission] = useState(0);

  // Calculate progress percentage after the state is initialized
  const progressPercentage = Math.round((totalWaste / 60) * 100);

  // Fetch waste items and community carbon emission
  useEffect(() => {
    const fetchWasteItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://carbonpatrol.top:8081/api/items');
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

    // Function to fetch community carbon emission
    const fetchCommunityCarbonData = async () => {
      try {
        const response = await fetch('https://carbonpatrol.top:8081/api/footprint/total');
        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
        const data = await response.json();
        setCommunityCarbonEmission(data.total || 0);
      } catch (err) {
        console.error("Failed to fetch community carbon emission:", err);
      }
    };

    fetchWasteItems();
    fetchCommunityCarbonData();
  }, []);

  // Function to fetch community carbon emission (separate for external calls)
  const fetchCommunityCarbonEmission = async () => {
    try {
      const response = await fetch('https://carbonpatrol.top:8081/api/footprint/total');
      if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
      const data = await response.json();
      setCommunityCarbonEmission(data.total || 0);
      return data.total || 0;
    } catch (err) {
      console.error("Failed to fetch community carbon emission:", err);
      return communityCarbonEmission; // Return current value if fetch fails
    }
  };

  // Function to save carbon emission to the database
  const saveCarbonEmissionToDatabase = async (carbonAmount) => {
    try {
      const response = await fetch('https://carbonpatrol.top:8081/api/footprint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ footprint: carbonAmount }),
      });

      if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

      const data = await response.json();
      console.log('Carbon footprint saved:', data);

      // Update community carbon emission after successful save
      if (data.new_total) {
        setCommunityCarbonEmission(data.new_total);
      } else {
        // If new_total not provided, fetch the latest
        fetchCommunityCarbonEmission();
      }

      return data;
    } catch (err) {
      console.error("Failed to save carbon emission:", err);
      toast.error("Failed to save your carbon footprint to the community database");
      return null;
    }
  };

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

  const incrementCountByMaterial = (materialName, quantity = 1) => {
    const matchedItem = wasteItems.find(item =>
      item.item.toLowerCase() === materialName.toLowerCase()
    );

    if (!matchedItem) {
      console.warn(`未找到匹配的材料: ${materialName}`);
      return false;
    }

    setCounts(prev => {
      const newCounts = {
        ...prev,
        [matchedItem.id]: (prev[matchedItem.id] || 0) + quantity
      };
      localStorage.setItem('wasteCounts', JSON.stringify(newCounts));
      setHasUnsavedChanges(true);
      return newCounts;
    });

    return true;
  };

  const incrementCount = (type) => {
    setCounts(prev => ({ ...prev, [type]: prev[type] + 1 }));
    setHasUnsavedChanges(true);
  };

  const decrementCount = (type) => {
    setCounts(prev => ({ ...prev, [type]: prev[type] > 0 ? prev[type] - 1 : 0 }));
    setHasUnsavedChanges(true);
  };

  // Direct method to add items and save immediately
  const addItemAndSave = async (materialName, quantity = 1) => {
    const matchedItem = wasteItems.find(item =>
      item.item.toLowerCase() === materialName.toLowerCase()
    );

    if (!matchedItem) {
      console.warn(`fail to match the material: ${materialName}`);
      return false;
    }

    // First update counts
    const newCounts = {
      ...counts,
      [matchedItem.id]: (counts[matchedItem.id] || 0) + quantity
    };
    localStorage.setItem('wasteCounts', JSON.stringify(newCounts));
    setCounts(newCounts);

    // Then immediately calculate and save all data
    let newWeight = 0;
    let newCount = 0;
    let newCarbon = 0;

    wasteItems.forEach(item => {
      const count = Number(newCounts[item.id]) || 0;
      const itemWeight = count * item.kg_per_item;
      newCount += count;
      newWeight += itemWeight;
      newCarbon += itemWeight * item.kg_co2_per_kg_item;
    });

    const totalWeightAfterSave = totalWaste + newWeight;
    const cycles = Math.floor(totalWeightAfterSave / 60);
    const updatedTotalWaste = totalWeightAfterSave % 60;
    const updatedWastebinCollected = wastebinCollected + cycles;
    const updatedTotalCarbonEmission = totalCarbonEmission + newCarbon;

    const updatedAccumulatedWeights = { ...accumulatedWeights };
    wasteItems.forEach(item => {
      const count = newCounts[item.id] || 0;
      updatedAccumulatedWeights[item.id] = (updatedAccumulatedWeights[item.id] || 0) + (count * item.kg_per_item);
    });

    const resetCounts = Object.keys(newCounts).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});
    const updatedTotalAccumulatedWaste = totalAccumulatedWaste + newWeight;

    // Update localStorage
    localStorage.setItem('totalWaste', updatedTotalWaste.toString());
    localStorage.setItem('totalCount', (totalCount + newCount).toString());
    localStorage.setItem('accumulatedWeights', JSON.stringify(updatedAccumulatedWeights));
    localStorage.setItem('wasteCounts', JSON.stringify(resetCounts));
    localStorage.setItem('wastebinCollected', updatedWastebinCollected.toString());
    localStorage.setItem('totalAccumulatedWaste', updatedTotalAccumulatedWaste.toString());
    localStorage.setItem('totalCarbonEmission', updatedTotalCarbonEmission.toString());

    // Update state
    setWastebinCollected(updatedWastebinCollected);
    setTotalWaste(updatedTotalWaste);
    setTotalCount(totalCount + newCount);
    setAccumulatedWeights(updatedAccumulatedWeights);
    setCounts(resetCounts);
    setHasUnsavedChanges(false);
    setTotalAccumulatedWaste(updatedTotalAccumulatedWaste);
    setTotalCarbonEmission(updatedTotalCarbonEmission);

    // Save carbon emission to database
    if (newCarbon > 0) {
      await saveCarbonEmissionToDatabase(newCarbon);
    }

    // Show toast messages
    if (cycles > 0) {
      toast.success(`Awesome! You've planted ${cycles} new tree${cycles > 1 ? 's' : ''}! Progress: ${updatedTotalWaste.toFixed(1)}/60kg`);
    }
    toast.success(`Great job! You recycled: ${newCount} item${newCount > 1 ? 's' : ''}, totaling ${newWeight.toFixed(2)}kg`);

    return true;
  };

  const saveData = async () => {
    try {
      let newWeight = 0;
      let newCount = 0;
      let newCarbon = 0;

      wasteItems.forEach(item => {
        const count = Number(counts[item.id]) || 0;
        const itemWeight = count * item.kg_per_item;
        newCount += count;
        newWeight += itemWeight;
        newCarbon += itemWeight * item.kg_co2_per_kg_item;
      });

      const totalWeightAfterSave = totalWaste + newWeight;
      const cycles = Math.floor(totalWeightAfterSave / 60);
      const updatedTotalWaste = totalWeightAfterSave % 60;
      const updatedWastebinCollected = wastebinCollected + cycles;
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
      localStorage.setItem('totalCount', (totalCount + newCount).toString());
      localStorage.setItem('accumulatedWeights', JSON.stringify(updatedAccumulatedWeights));
      localStorage.setItem('wasteCounts', JSON.stringify(resetCounts));
      localStorage.setItem('wastebinCollected', updatedWastebinCollected.toString());
      localStorage.setItem('totalAccumulatedWaste', updatedTotalAccumulatedWaste.toString());
      localStorage.setItem('totalCarbonEmission', updatedTotalCarbonEmission.toString());

      setWastebinCollected(updatedWastebinCollected);
      setTotalWaste(updatedTotalWaste);
      setTotalCount(prev => prev + newCount);
      setAccumulatedWeights(updatedAccumulatedWeights);
      setCounts(resetCounts);
      setHasUnsavedChanges(false);
      setTotalAccumulatedWaste(updatedTotalAccumulatedWaste);
      setTotalCarbonEmission(updatedTotalCarbonEmission);

      // Save carbon emission to database
      if (newCarbon > 0) {
        await saveCarbonEmissionToDatabase(newCarbon);
      }

      if (cycles > 0) {
        toast.success(`Awesome! You've planted ${cycles} new tree${cycles > 1 ? 's' : ''}! Progress: ${updatedTotalWaste.toFixed(1)}/60kg`);
      }
      toast.success(`Great job! You recycled: ${newCount} item${newCount > 1 ? 's' : ''}, totaling ${newWeight.toFixed(2)}kg`);

    } catch (error) {
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

  const handleSaveProgress = () => {
    try {
      const success = exportDataAsDB();
      if (success) {
        toast.success('Progress saved successfully! File downloaded to your computer.');
      }
    } catch (error) {
      console.error('Failed to save progress:', error);
      toast.error('Failed to save progress. Please try again.');
    }
  };

  const handleLoadProgress = async (file) => {
    try {
      const result = await importDataFromDB(file);
      
      if (result.success) {
        // Refresh all state values from localStorage
        const savedCounts = localStorage.getItem('wasteCounts');
        setCounts(savedCounts ? JSON.parse(savedCounts) : {});
        
        const savedWeights = localStorage.getItem('accumulatedWeights');
        setAccumulatedWeights(savedWeights ? JSON.parse(savedWeights) : {});
        
        setUserName(localStorage.getItem('userName') || 'Anonymous');
        setTotalCount(parseInt(localStorage.getItem('totalCount') || '0'));
        setWastebinCollected(parseInt(localStorage.getItem('wastebinCollected')) || 0);
        setTotalWaste(parseFloat(localStorage.getItem('totalWaste') || '0'));
        setTotalAccumulatedWaste(parseFloat(localStorage.getItem('totalAccumulatedWaste') || '0'));
        setTotalCarbonEmission(parseFloat(localStorage.getItem('totalCarbonEmission') || '0'));
        
        toast.success('Progress loaded successfully!');
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
      toast.error(`Failed to load progress: ${error.message}`);
    }
  };

  // Include new functions in the return object
  return {
    // All existing returned values
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
    totalCount,
    wastebinCollected,
    totalAccumulatedWaste,
    totalCarbonEmission,
    communityCarbonEmission,
    setCounts,
    handleNameClick,
    handleNameSave,
    setUserName,
    incrementCount,
    decrementCount,
    saveData,
    incrementCountByMaterial,
    addItemAndSave,
    saveCarbonEmissionToDatabase,
    fetchCommunityCarbonEmission,
    handleSaveProgress,
    handleLoadProgress
  };
};

export default useWasteData;