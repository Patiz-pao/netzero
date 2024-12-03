"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useForm, Controller } from "react-hook-form";

import { useCalculationData } from "@/app/calculation/page.hook";
import { Calculation } from "@/types/types";
import { CheckedState } from "@radix-ui/react-checkbox";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useState } from "react";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const SolarCalculation = () => {
  const {
    setIsCustomArea,
    handleProvinceChange,
    setCalculationResult,
    selectedProvince,
    provinces,
    tumbols,
    isCustomArea,
    areaOptions,
    calculationResult,
  } = useCalculationData();

  const { handleSubmit, control, setValue, reset } = useForm<Calculation>();
  const [chartData, setChartData] = useState<any>(null);

  const handleClear = () => {
    reset();
    setCalculationResult(null);
    setChartData(null);
    setIsCustomArea(false);
  };

  const onSubmit = async (data: Calculation) => {
    const area = isCustomArea ? data.customAreaValue : data.area;
    const formData = {
      province: data.province,
      tumbol: data.tumbol,
      area: area,
    };
    try {
      const response = await fetch("/api/calculation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log("Server Response:", responseData);
      setCalculationResult(responseData.data);

      const totalArea = responseData.data.area * 1600;
      const areaUsed = responseData.data.numberOfPanels * 2;
      const areaRemaining = totalArea - areaUsed;

      setChartData({
        labels: ["พื้นที่ทั้งหมด", "พื้นที่ที่ใช้ไป", "พื้นที่ที่เหลือ"],
        datasets: [
          {
            label: "พื้นที่ (ตร.ม.)",
            data: [totalArea, areaUsed, areaRemaining],
            backgroundColor: ["#039dfc", "#f87171", "#34d399"],
            borderColor: ["#000000", "#9b2c2c", "#047857"],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Solar Panel Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div>
              <Label>จังหวัด</Label>
              <Controller
                name="province"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={(value) => {
                      handleProvinceChange(value);
                      setValue("province", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกจังหวัด" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((data) => (
                        <SelectItem key={data.province} value={data.province}>
                          {data.province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label>ตำบล</Label>
              <Controller
                name="tumbol"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    disabled={!selectedProvince}
                    onValueChange={(value) => setValue("tumbol", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกตำบล" />
                    </SelectTrigger>
                    <SelectContent>
                      {tumbols.map((tumbol) => (
                        <SelectItem key={tumbol} value={tumbol}>
                          {tumbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="customArea"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <Checkbox
                    id="customArea"
                    checked={field.value}
                    onCheckedChange={(checked: CheckedState) => {
                      if (checked === true || checked === false) {
                        field.onChange(checked);
                        setIsCustomArea(checked);
                      }
                    }}
                  />
                )}
              />
              <Label htmlFor="customArea">กรอกจำนวนไร่เอง</Label>
            </div>

            {!isCustomArea ? (
              <Controller
                name="area"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue("area", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกจำนวนไร่" />
                    </SelectTrigger>
                    <SelectContent>
                      {areaOptions.map((area) => (
                        <SelectItem key={area} value={area.toString()}>
                          {area} ไร่
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            ) : (
              <Controller
                name="customAreaValue"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    value={field.value || ""}
                    placeholder="กรอกจำนวนไร่"
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(e);
                      setValue("area", value);
                    }}
                  />
                )}
              />
            )}

            <Button type="submit">คำนวณ</Button>
            <Button type="button" variant="outline" onClick={handleClear}>
              Clear
            </Button>
            <Separator />
          </form>

          {calculationResult && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">ผลคำนวณ</h3>
              <Card className="">
                <CardContent>
                  <div className="mt-5">
                    <p>
                      ความเข้มพลังงานแสงอาทิตย์:{" "}
                      <span className="font-bold text-green-700">
                        {calculationResult.solarEnergyIntensity}
                      </span>{" "}
                      W/m²
                    </p>
                    <p>
                      จำนวนแผงโซล่าเซลล์ที่ต้องการ:{" "}
                      <span className="font-bold text-red-700">
                        {calculationResult.numberOfPanels}
                      </span>{" "}
                      แผ่น
                    </p>
                    <p>
                      จำนวนไฟฟ้าที่ต้องการ:{" "}
                      <span className="font-bold text-red-700">
                        {calculationResult.requiredElectricity}
                      </span>{" "}
                      kWh
                    </p>
                    <p>
                      จำนวนไฟฟ้าที่ผลิตได้:{" "}
                      <span className="font-bold text-green-700">
                        {calculationResult.producedElectricity}
                      </span>{" "}
                      kWh
                    </p>
                    <p>
                      จำนวนไฟฟ้าที่ผลิตเกิน:{" "}
                      <span className="font-bold text-green-700">
                        {calculationResult.excessElectricity}
                      </span>{" "}
                      kWh
                    </p>
                    <p>
                      พื้นที่ที่ใช้ในการติดตั้ง:{" "}
                      <span className="font-bold text-green-700">
                        {calculationResult.areaUsed}
                      </span>{" "}
                      m²
                    </p>
                    <p>
                      พื้นที่ที่เหลือ:{" "}
                      <span className="font-bold text-green-700">
                        {calculationResult.areaRemaining}
                      </span>{" "}
                      m²
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {chartData && (
            <div>
              <div className="w-[70%] mx-auto">
                <div className="mt-4">
                  <Bar data={chartData} options={{ responsive: true }} />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SolarCalculation;
