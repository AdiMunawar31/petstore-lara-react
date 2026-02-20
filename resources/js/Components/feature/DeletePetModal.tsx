import Modal from '@/Components/ui/Modal';
import Button from '@/Components/ui/Button';
import { AlertTriangle } from 'lucide-react';
import type { Pet } from '@/types';

interface DeletePetModalProps {
    pet: Pet | null;
    open: boolean;
    onClose: () => void;
    onConfirm: (petId: number) => void;
    isLoading?: boolean;
}

export default function DeletePetModal({ pet, open, onClose, onConfirm, isLoading }: DeletePetModalProps) {
    if (!pet) return null;

    return (
        <Modal open={open} onClose={onClose} title="Hapus Pet" size="sm">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                    <AlertTriangle size={24} className="text-d2y-red" />
                </div>
                <div>
                    <p className="text-sm text-gray-700">
                        Apakah Anda yakin ingin menghapus <span className="font-semibold text-gray-900">{pet.name}</span>?
                    </p>
                    <p className="mt-1 text-xs text-d2y-gray-1">Tindakan ini tidak dapat dibatalkan.</p>
                </div>
                <div className="mt-2 flex w-full gap-3">
                    <Button variant="secondary" fullWidth onClick={onClose}>
                        Batal
                    </Button>
                    <Button variant="danger" fullWidth loading={isLoading} onClick={() => onConfirm(pet.id)}>
                        Hapus
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
