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

const SolarCalculation = () => {
  const {
    selectedProvince,
    handleProvinceChange,
    provinces,
    selectedTumbol,
    setSelectedTumbol,
    tumbols,
    isCustomArea,
    setIsCustomArea,
    selectedArea,
    setSelectedArea,
    areaOptions,
    customArea,
    setCustomArea,
    calculateSolarEnergy,
  } = useCalculationData();
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Solar Panel Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label>จังหวัด</Label>
              <Select
                value={selectedProvince}
                onValueChange={handleProvinceChange}
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
            </div>
            <div>
              <Label>ตำบล</Label>
              <Select
                value={selectedTumbol}
                onValueChange={setSelectedTumbol}
                disabled={!selectedProvince}
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
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="customArea"
                checked={isCustomArea}
                onCheckedChange={() => setIsCustomArea(!isCustomArea)}
              />
              <Label htmlFor="customArea">กรอกจำนวนไร่เอง</Label>
            </div>

            {!isCustomArea ? (
              <Select
                value={selectedArea?.toString() || ""}
                onValueChange={(value) => setSelectedArea(Number(value))}
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
            ) : (
              <Input
                type="number"
                placeholder="กรอกจำนวนไร่"
                value={customArea}
                onChange={(e) => setCustomArea(e.target.value)}
              />
            )}

            <Button
              onClick={calculateSolarEnergy}
              disabled={
                !selectedProvince ||
                !selectedTumbol ||
                (!selectedArea && !customArea)
              }
            >
              คำนวณ
            </Button>
            <Separator />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolarCalculation;
