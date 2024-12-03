"use client";
import { useEffect, useState } from "react";
import Papa from "papaparse";

interface Province {
  province: string;
  tumbols: string[];
}

export const useCalculationData = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [tumbols, setTumbols] = useState<string[]>([]);
  const [selectedTumbol, setSelectedTumbol] = useState<string>("");

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

  const calculateSolarEnergy = () => {
    console.log("Click!");
  };
  return {
    setIsCustomArea,
    handleProvinceChange,
    selectedProvince,
    provinces,
    tumbols,
    isCustomArea,
    areaOptions,
  };
};
