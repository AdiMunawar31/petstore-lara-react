import { useState } from 'react';
import Input from '@/Components/ui/Input';
import Select from '@/Components/ui/Select';
import Button from '@/Components/ui/Button';
import { Plus, X, PawPrint } from 'lucide-react';
import type { Pet, PetFormData, PetStatus } from '@/types';

interface PetFormProps {
    defaultValues?: Partial<Pet>;
    onSubmit: (data: PetFormData) => void;
    isLoading?: boolean;
    submitLabel?: string;
}

export default function PetForm({ defaultValues, onSubmit, isLoading, submitLabel = 'Simpan' }: PetFormProps) {
    const [name, setName] = useState(defaultValues?.name ?? '');
    const [status, setStatus] = useState<PetStatus>(defaultValues?.status ?? 'available');
    const [categoryName, setCategoryName] = useState(defaultValues?.category?.name ?? '');
    const [photoUrl, setPhotoUrl] = useState(defaultValues?.photoUrls?.[0] ?? '');
    const [tags, setTags] = useState<string[]>(defaultValues?.tags?.map((t) => t.name) ?? []);
    const [tagInput, setTagInput] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const e: Record<string, string> = {};
        if (!name.trim()) e.name = 'Nama pet wajib diisi';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const addTag = () => {
        const t = tagInput.trim();
        if (t && !tags.includes(t)) {
            setTags([...tags, t]);
            setTagInput('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const data: PetFormData = {
            name: name.trim(),
            status,
            photoUrls: photoUrl.trim() ? [photoUrl.trim()] : [],
            category: categoryName.trim() ? { id: 0, name: categoryName.trim() } : undefined,
            tags: tags.map((t, i) => ({ id: i, name: t })),
        };

        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Nama Pet"
                placeholder="contoh: Buddy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                leftIcon={<PawPrint size={15} />}
            />

            <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as PetStatus)}>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
            </Select>

            <Input label="Kategori" placeholder="contoh: Dogs" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />

            <Input
                label="URL Foto"
                placeholder="https://example.com/foto.jpg"
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
            />

            {/* Tags */}
            <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Tags</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addTag();
                            }
                        }}
                        placeholder="Tambah tag..."
                        className="rounded-ios border-ios-gray-4 focus:ring-ios-blue flex-1 border px-3.5 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                    />
                    <Button type="button" variant="secondary" size="md" icon={<Plus size={15} />} onClick={addTag} />
                </div>
                {tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-ios-blue inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium"
                            >
                                {tag}
                                <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))}>
                                    <X size={12} />
                                </button>
                            </span>
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
