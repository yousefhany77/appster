import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { HStack, Input, VStack } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import autocompleteCountryandCity from "../util/autocompleteCountryandCity";

interface Props {
  value: { country: string; city: string };
  setValue: any;
  formikProps: any;
}

function SelecLocation({ value, setValue, formikProps }: Props) {
  const [countries, setCountries] = useState<any[]>([]);
  const [showCountries, setShowCountries] = useState<boolean>(false);
  const [cities, setCities] = useState<any[]>([]);
  const [showCities, setShowCities] = useState<boolean>(false);
  const [location, setLocation] = useState<{
    country: string;
    city: string;
  }>({
    country: "",
    city: "",
  });
  const devalueCountry = useDebounce({
    value: location.country,
    delay: 600,
  });
  const devalueCity = useDebounce({
    value: location.city,
    delay: 600,
  });

  useEffect(() => {
    const autocomplete = async () => {
      const data = await autocompleteCountryandCity(devalueCountry);
      if (data) {
        setCountries(data);
      }
    };
    autocomplete();
  }, [devalueCountry]);

  useEffect(() => {
    if (devalueCity === "" || devalueCity === undefined) return;
    if (value.country === "" || value.country === undefined) return;
    const autocomplete = async () => {
      const data = await autocompleteCountryandCity(devalueCity, value.country);
      if (data) {
        setCities(data);
      }
    };
    autocomplete();
  }, [devalueCity, value.country]);
  return (
    <HStack alignItems={"start"} w={"100%"}>
      <FormControl
        isRequired
        isInvalid={formikProps.errors.country && formikProps.touched.country}
      >
        <FormLabel className="font-bold">Country</FormLabel>
        <Input
          type="text"
          {...formikProps.getFieldProps("country")}
          value={value.country || location.country}
          onChange={(e) => {
            formikProps.handleChange(e);

            setLocation((prev) => {
              return { ...prev, country: e.target.value };
            });
            // setValue(prev => { return { ...prev, country: e.target.value } });
            setShowCountries(true);
          }}
        />
        <FormErrorMessage>{formikProps.errors.country}</FormErrorMessage>
        {showCountries && (
          <VStack
            border={"1px solid #e2e8f0"}
            rounded={"md"}
            margin={2}
            bg={"gray.300"}
            spacing={2}
            maxHeight={100}
            className="overflow-y-scroll"
          >
            {countries.map((country) => {
              return (
                <span
                  className="cursor-pointer w-full text-center  p-1.5 rounded-md hover:bg-slate-400 "
                  key={country.id}
                  onClick={() => {
                    setValue((prev: any) => {
                      return { ...prev, country: country.id };
                    });
                    setLocation((prev) => {
                      return { ...prev, country: country.name };
                    });
                    setShowCountries(false);
                  }}
                >
                  {country.name}
                </span>
              );
            })}
          </VStack>
        )}
      </FormControl>
      <FormControl
        isRequired
        isInvalid={formikProps.errors.city && formikProps.touched.city}
      >
        <FormLabel className="font-bold">City</FormLabel>
        <Input
          disabled={value.country === "" || value.country === undefined}
          type="text"
          {...formikProps.getFieldProps("city")}
          value={value.city || location.city}
          onChange={(e) => {
            formikProps.handleChange(e);

            setLocation((prev) => {
              return { ...prev, city: e.target.value };
            });
            // setValue(prev => { return { ...prev, city: e.target.value } });
            setShowCities(true);
          }}
        />
        <FormErrorMessage>{formikProps.errors.city}</FormErrorMessage>
        {showCities && (
          <VStack
            border={"1px solid #e2e8f0"}
            rounded={"md"}
            margin={2}
            bg={"gray.300"}
            spacing={2}
            maxHeight={100}
            className="overflow-y-scroll"
          >
            {cities.map((city) => {
              return (
                <span
                  className="cursor-pointer w-full text-center  p-1.5 rounded-md hover:bg-slate-400 "
                  key={city.id}
                  onClick={() => {
                    setValue((prev: any) => {
                      return { ...prev, city: city.name };
                    });
                    setLocation((prev) => {
                      return { ...prev, city: city.name };
                    });
                    setShowCities(false);
                  }}
                >
                  {city.name}
                </span>
              );
            })}
          </VStack>
        )}
      </FormControl>
    </HStack>
  );
}

export default SelecLocation;
