import Modal from '@/Components/ui/Modal';
import Button from '@/Components/ui/Button';
import { LogOut } from 'lucide-react';

interface LogoutConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export default function LogoutConfirmModal({ open, onClose, onConfirm, isLoading }: LogoutConfirmModalProps) {
    return (
        <Modal open={open} onClose={onClose} title="Keluar Akun" size="sm">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                    <LogOut size={24} className="text-d2y-red" />
                </div>

                <div>
                    <p className="text-sm text-gray-700">
                        Apakah Anda yakin ingin <span className="font-semibold text-gray-900">keluar</span> dari akun ini?
                    </p>
                    <p className="mt-1 text-xs text-d2y-gray-1">Anda harus login kembali untuk mengakses dashboard.</p>
                </div>

                <div className="mt-2 flex w-full gap-3">
                    <Button variant="secondary" fullWidth onClick={onClose}>
                        Batal
                    </Button>
                    <Button variant="danger" fullWidth loading={isLoading} onClick={onConfirm}>
                        Keluar
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
