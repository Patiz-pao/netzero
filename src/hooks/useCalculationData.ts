"use client";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import { useForm } from "react-hook-form";
import { Calculation } from "@/types/types";
import { useActiveTab } from "@/hooks/useActiveTab";

interface Province {
  province: string;
  tumbols: string[];
}

export const useCalculationData = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [tumbols, setTumbols] = useState<string[]>([]);
  const [selectedTumbol, setSelectedTumbol] = useState<string>("");
  const [calculationResult, setCalculationResult] = useState<any>(null);

  const { activeTab, changeTab } = useActiveTab("electricity");

  const [isCustomArea, setIsCustomArea] = useState<boolean>(false);
  const [areaOptions] = useState<number[]>(
    Array.from({ length: 10 }, (_, i) => i + 1)
  );

  useEffect(() => {
    fetch("/data/data.csv")
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          complete: (result) => {
            const provincesData = parseProvinces(result.data);
            setProvinces(provincesData);
          },
          header: true,
        });
      })
      .catch((error) => console.error("Error loading CSV file", error));
  }, []);

  const parseProvinces = (data: any[]): Province[] => {
    const provinceMap: { [key: string]: Set<string> } = {};

    data.forEach((row) => {
      const provinceName = row.Province;
      const tumbolName = row.Tumbol;

      if (!provinceName || !tumbolName) return;

      if (!provinceMap[provinceName]) {
        provinceMap[provinceName] = new Set();
      }
      provinceMap[provinceName].add(tumbolName);
    });

    const provincesData: Province[] = Object.keys(provinceMap).map(
      (provinceName) => ({
        province: provinceName,
        tumbols: Array.from(provinceMap[provinceName]),
      })
    );
    return provincesData;
  };

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    const selectedProvinceData = provinces.find((p) => p.province === province);
    setTumbols(selectedProvinceData?.tumbols || []);
    setSelectedTumbol("");
  };

  const { handleSubmit, control, setValue, reset } = useForm<Calculation>();
  const [chartData, setChartData] = useState<any>(null);
  const [chartDataElectric, setChartDataElectric] = useState<any>(null);
  const [chartDataghg, setChartDatghg] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const handleClear = () => {
    reset();
    setCalculationResult(null);
    setChartData(null);
    setIsCustomArea(false);
    setValue("province", "");
    setValue("tumbol", "");
    setValue("type", "");
    setValue("treeType", "");
  };

  return {
    setIsCustomArea,
    handleProvinceChange,
    setCalculationResult,
    setChartData,
    handleClear,
    handleSubmit,
    setValue,
    setChartDatghg,
    setChartDataElectric,
    changeTab,
    setLoading,
    loading,
    activeTab,
    chartDataghg,
    chartDataElectric,
    chartData,
    control,
    selectedProvince,
    provinces,
    tumbols,
    isCustomArea,
    areaOptions,
    calculationResult,
  };
};
