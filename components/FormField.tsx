import React from 'react';
import {FormControl, FormDescription, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Controller, FieldValues, Control, Path} from "react-hook-form"; // Use correct types
import {Input} from "@/components/ui/input"; // Update import as needed

interface FormFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder: string;
    type: 'text' | 'email' | 'password' | 'file';
}

function FormField<T extends FieldValues>({
                                              control,
                                              name,
                                              label,
                                              placeholder,
                                              type = "text",
                                          }: FormFieldProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({field}) => (
                <FormItem>
                    <FormLabel className="label">{label}</FormLabel>
                    <FormControl>
                        <Input
                            className="input"
                            placeholder={placeholder}
                            type={type}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
}

export default FormField;
