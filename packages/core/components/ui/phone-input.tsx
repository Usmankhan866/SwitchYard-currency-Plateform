"use client";

import * as React from "react";
import {
  parsePhoneNumberFromString,
  AsYouType,
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { Input } from "./input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

// Flag emoji from country code
function getFlag(countryCode: CountryCode): string {
  return countryCode
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

// Country display name
function getCountryName(code: CountryCode): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

// Top countries shown first
const TOP_COUNTRIES: CountryCode[] = ["US", "GB", "CA", "AU", "DE", "FR"];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultCountry?: CountryCode;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

function PhoneInput({
  value,
  onChange,
  defaultCountry = "US",
  placeholder = "Phone number",
  disabled,
  className,
}: PhoneInputProps) {
  const [country, setCountry] = React.useState<CountryCode>(defaultCountry);
  const [open, setOpen] = React.useState(false);

  const allCountries = React.useMemo(() => {
    const codes = getCountries();
    const top = TOP_COUNTRIES.filter((c) => codes.includes(c));
    const rest = codes.filter((c) => !TOP_COUNTRIES.includes(c)).sort((a, b) =>
      getCountryName(a).localeCompare(getCountryName(b))
    );
    return { top, rest };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatter = new AsYouType(country);
    const formatted = formatter.input(raw);
    onChange(formatted);
  };

  const handleCountrySelect = (code: CountryCode) => {
    setCountry(code);
    setOpen(false);
    // Re-format current value with new country
    if (value) {
      const parsed = parsePhoneNumberFromString(value, country);
      if (parsed) {
        const formatter = new AsYouType(code);
        onChange(formatter.input(parsed.nationalNumber));
      }
    }
  };

  const callingCode = `+${getCountryCallingCode(country)}`;

  return (
    <div
      data-slot="phone-input"
      className={cn("flex gap-0", className)}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "inline-flex h-9 items-center gap-1 rounded-s-md border border-e-0 border-input bg-transparent px-2 text-sm transition-colors",
              "hover:bg-accent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:z-10",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <span className="text-base leading-none">{getFlag(country)}</span>
            <span className="text-xs text-muted-foreground">{callingCode}</span>
            <ChevronsUpDown className="size-3 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup heading="Popular">
                {allCountries.top.map((code) => (
                  <CommandItem
                    key={code}
                    value={`${getCountryName(code)} ${code}`}
                    onSelect={() => handleCountrySelect(code)}
                  >
                    <span className="me-2 text-base">{getFlag(code)}</span>
                    <span className="flex-1">{getCountryName(code)}</span>
                    <span className="text-xs text-muted-foreground">
                      +{getCountryCallingCode(code)}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="All countries">
                {allCountries.rest.map((code) => (
                  <CommandItem
                    key={code}
                    value={`${getCountryName(code)} ${code}`}
                    onSelect={() => handleCountrySelect(code)}
                  >
                    <span className="me-2 text-base">{getFlag(code)}</span>
                    <span className="flex-1">{getCountryName(code)}</span>
                    <span className="text-xs text-muted-foreground">
                      +{getCountryCallingCode(code)}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Input
        type="tel"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        className="rounded-s-none"
      />
    </div>
  );
}

export { PhoneInput };
