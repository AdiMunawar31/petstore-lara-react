import React, { useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Input from '@/Components/ui/Input';
import Select from '@/Components/ui/Select';
import Button from '@/Components/ui/Button';
import { Plus, X, PawPrint } from 'lucide-react';

import type { Pet, PetFormData, PetStatus } from '@/types';

const petSchema = z.object({
    id: z.number(),
    name: z.string().min(1, 'Nama pet wajib diisi').max(100),
    status: z.enum(['available', 'pending', 'sold']),
    categoryName: z.string().max(50).optional(),
    photoUrl: z.string().url('URL foto tidak valid').or(z.literal('')).optional(),
    tags: z
        .array(
            z.object({
                name: z.string().min(1, 'Tag tidak boleh kosong'),
            }),
        )
        .optional(),
});

type PetFormSchema = z.infer<typeof petSchema>;

interface PetFormProps {
    defaultValues?: Partial<Pet>;
    onSubmit: (data: PetFormData) => void;
    isLoading?: boolean;
    submitLabel?: string;
}

export default function PetForm({ defaultValues, onSubmit, isLoading, submitLabel = 'Simpan' }: PetFormProps) {
    console.log('React version:', React.version);

    const formDefaults = useMemo<PetFormSchema>(
        () => ({
            id: 0,
            name: defaultValues?.name ?? '',
            status: defaultValues?.status ?? 'available',
            categoryName: defaultValues?.category?.name ?? '',
            photoUrl: defaultValues?.photoUrls?.[0] ?? '',
            tags:
                defaultValues?.tags?.map((t) => ({
                    name: t.name,
                })) ?? [],
        }),
        [defaultValues],
    );

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PetFormSchema>({
        resolver: zodResolver(petSchema),
        defaultValues: formDefaults,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'tags',
    });

    const submitHandler = (values: PetFormSchema) => {
        console.log('SUbmit Call....', values);
        const payload: PetFormData = {
            id: values.id,
            name: values.name.trim(),
            status: values.status as PetStatus,
            photoUrls: values.photoUrl ? [values.photoUrl] : [],
            category: values.categoryName ? { id: 0, name: values.categoryName.trim() } : undefined,
            tags: values.tags?.map((t, i) => ({
                id: i,
                name: t.name.trim(),
            })),
        };

        console.log('payload : ', payload);

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <Input
                label="Nama Pet"
                placeholder="contoh: Buddy"
                leftIcon={<PawPrint size={15} />}
                error={errors.name?.message}
                {...register('name')}
            />

            <Controller
                control={control}
                name="status"
                render={({ field }) => (
                    <Select label="Status" {...field}>
                        <option value="available">Available</option>
                        <option value="pending">Pending</option>
                        <option value="sold">Sold</option>
                    </Select>
                )}
            />

            <Input label="Kategori" placeholder="contoh: Dogs" error={errors.categoryName?.message} {...register('categoryName')} />

            <Input
                label="URL Foto"
                placeholder="https://example.com/photo.jpg"
                type="url"
                error={errors.photoUrl?.message}
                {...register('photoUrl')}
            />

            <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Tags</label>

                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    icon={<Plus size={14} />}
                    onClick={() =>
                        append({
                            name: '',
                        })
                    }
                >
                    Tambah Tag
                </Button>

                {fields.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {fields.map((field, index) => (
                            <div key={index} className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
                                <input {...register(`tags.${index}.name`)} className="w-24 bg-transparent text-xs outline-none" />
                                <button type="button" onClick={() => remove(index)}>
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Button type="submit" fullWidth loading={isLoading} size="lg" className="mt-6">
                {submitLabel}
            </Button>
        </form>
    );
}
