"use client"

import { useEffect, useRef, useState } from 'react'
import { HiOutlinePlus, HiOutlineCreditCard, HiOutlineBanknotes, HiOutlineDevicePhoneMobile, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2"
import { AnimatePresence } from 'framer-motion'
import { UseFormClearErrors, UseFormReset } from 'react-hook-form'
import { walletCreateSchemaType } from '@/server/schemas/walletSchema'
import { useSnackbar } from '@/stores/toastStore'
import { useCreateWallet, useDeleteWallet, useGetWallet, useUpdateWallet } from '@/hooks/walletHook'
import ConfirmModal from '../components/DialogModal'
import ErrorModal from '../components/ErrorModal'
import { formatToRupiah } from '@/utils/fomatCurrency'
import { WalletSkeleton } from './components/Skeleton'
import { walletDTO } from '@/server/dto/walletDTO'
import WalletFormComponents from './components/FormComponent'
import MainModal from '../components/Mainmodal'


export default function WalletPage() {
    const [isModalOpen, setModalOpen] = useState(false)
    const [isErrMdOpen, setErrMdOpen] = useState(false)
    const [selectedWall, setSelectedWall] = useState<walletDTO | null>(null)
    const [errMsg, setErrMsg] = useState<string | null>(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [targetId, setTargetId] = useState<string | null>(null)

    const resetFormRef = useRef<UseFormReset<walletCreateSchemaType> | null>(null);
    const clearErrFormRef = useRef<UseFormClearErrors<walletCreateSchemaType> | null>(null);

    const { show: showToast } = useSnackbar()

    const { data, isLoading, error: getErrMsg, isError: getErr } = useGetWallet()
    const { mutate: createWall, error: createErrMsg, isPending: createPend, isError: createErr, isSuccess: createScss } = useCreateWallet()
    const { mutate: updateWall, error: updateErrMsg, isPending: updatePend, isError: updateErr, isSuccess: updateScss } = useUpdateWallet()
    const { mutate: deleteWall, error: deleteErrMsg, isPending: deletePend, isError: deleteErr, isSuccess: deleteScss } = useDeleteWallet()

    const handleOpenAdd = () => {
        setSelectedWall(null)
        setModalOpen(true)
    }

    const onSubmit = (value: walletCreateSchemaType) => {
        if (!selectedWall) {
            createWall(value)
        } else {
            updateWall({ ...value, id: selectedWall.id })
        }
    }

    const onDelete = () => {
        deleteWall({ id: targetId! })
    }

    const handleDelete = (id: string) => {
        setTargetId(id)
        setIsConfirmOpen(true)
    }

    const openModal = (wallet: walletDTO | null = null) => {
        if (resetFormRef.current) {
            resetFormRef.current({ ...wallet, balance: Number(wallet?.balance) })
        }
        setSelectedWall(wallet)
        setModalOpen(true)
    }

    const onModalClose = () => {
        if (clearErrFormRef.current) {
            clearErrFormRef.current()
        }
        setModalOpen(false)

    }

    useEffect(() => {
        if (getErr) {
            setErrMdOpen(getErr)
            setErrMsg(getErrMsg.message)
        }
        if (createErr) {
            setErrMdOpen(createErr)
            setErrMsg(createErrMsg.message)
        }
        if (updateErr) {
            setErrMdOpen(updateErr)
            setErrMsg(updateErrMsg.message)
        }
        if (deleteErr) {
            setErrMdOpen(deleteErr)
            setErrMsg(deleteErrMsg.message)
        }

    }, [getErr, createErr, updateErr, deleteErr])

    useEffect(() => {
        if (createScss) {
            setSelectedWall(null)
            setModalOpen(false)
            showToast("Wallet Created", "success")
            if (resetFormRef.current) {
                resetFormRef.current()
            }
        }
        if (updateScss) {
            setSelectedWall(null)
            setModalOpen(false)
            showToast("Wallet Updated", "success")
            if (resetFormRef.current) {
                resetFormRef.current()
            }
        }
        if (deleteScss) {
            setIsConfirmOpen(false)
            setTargetId(null)
            showToast("Wallet Deleted", "success")
        }
    }, [createScss, updateScss, deleteScss])

    if (isLoading) return <WalletSkeleton />


    return (
        <div className="space-y-8 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.data.map((wallet) => (
                    <div
                        key={wallet.id}
                        className="relative group bg-slate-900 border border-slate-800 p-6 rounded-4xl overflow-hidden transition-all hover:border-slate-700 shadow-xl"
                    >
                        <div className="absolute -right-10 -top-10 w-32 h-32 blur-[80px] opacity-20" />

                        <div className="flex justify-between items-start mb-8">
                            <div className="p-4 rounded-2xl bg-slate-800 text-white shadow-inner">
                                {wallet.type === 'BANK' && <HiOutlineCreditCard size={28} />}
                                {wallet.type === 'CASH' && <HiOutlineBanknotes size={28} />}
                                {wallet.type === 'E_WALLET' && <HiOutlineDevicePhoneMobile size={28} />}
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => { openModal(wallet); }} className="p-2 text-slate-500 hover:text-white transition-colors">
                                    <HiOutlinePencil size={18} />
                                </button>
                                <button onClick={() => handleDelete(wallet.id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors">
                                    <HiOutlineTrash size={18} />
                                </button>
                            </div>
                        </div>

                        <div>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mb-1">{wallet.name}</p>
                            <h3 className="text-3xl font-black text-white">
                                {formatToRupiah(wallet.balance)}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={handleOpenAdd}
                className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-2xl shadow-indigo-500/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
            >
                <HiOutlinePlus className="w-8 h-8 transition-transform group-hover:rotate-90" />

                {/* Tooltip */}
                <span className="absolute right-20 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-700">
                    Create New Wallet
                </span>
            </button>
            <AnimatePresence>
                {isModalOpen && (
                    <MainModal
                        onClose={onModalClose}
                        modalName={Boolean(selectedWall) ? "Update Wallet" : "Create Wallet"}
                    >
                        <WalletFormComponents
                            onSubmit={onSubmit}
                            isPending={createPend || updatePend}
                            clearError={(clrErr) => {
                                clearErrFormRef.current = clrErr
                            }}
                            resetVal={(resetVal) => {
                                resetFormRef.current = resetVal
                            }}
                            dataEdit={selectedWall}

                        />
                    </MainModal>
                )}
            </AnimatePresence>
            <ConfirmModal
                isPending={deletePend}
                isOpen={isConfirmOpen}
                message='This action cannot be undone. All records linked to this wallet will lose their reference.'
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={onDelete}
            />
            <ErrorModal isOpen={isErrMdOpen} onClose={() => setErrMdOpen(false)} message={errMsg || ""} />
        </div>
    )
}