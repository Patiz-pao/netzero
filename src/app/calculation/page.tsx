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

const SolarCalculation = () => {
  const {
    selectedProvince,
    provinces,
    tumbols,
    isCustomArea,
    areaOptions,
    handleProvinceChange,
    setIsCustomArea,
  } = useCalculationData();

  const { handleSubmit, control, setValue } = useForm<Calculation>();

  const onSubmit = async (data: Calculation) => {
    const area = isCustomArea ? data.customAreaValue : data.area;
    const formData = {
      province: data.province,
      tumbol: data.tumbol,
      area: area,
    };
    try {
      const response = await fetch('/api/calculation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();
      console.log('Server Response:', responseData);
    } catch (error) {
      console.error('Error submitting data:', error);
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
            <Separator />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolarCalculation;
