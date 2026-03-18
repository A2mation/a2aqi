"use client"

import { useEffect, useState } from 'react'
import { Modal } from '../ui/modal'
import { Button } from '../ui/button'
import { Input } from '../ui/input' // Assuming you have an Input component

interface ConfirmActionModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    loading: boolean
    passphrase: string // The text the user MUST type
}

const ConfirmActionModal = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
    passphrase
}: ConfirmActionModalProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [userInput, setUserInput] = useState("");

    // Reset input when modal opens/closes
    useEffect(() => {
        setIsMounted(true);
        if (!isOpen) {
            setUserInput("");
        }
    }, [isOpen])

    if (!isMounted) {
        return null;
    }

    // Validation logic
    const isMatch = userInput === passphrase;

    return (
        <Modal
            title='Critical Action Confirmation'
            description={`Please type "${passphrase}" to confirm.`}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="space-y-4 py-4">
                <Input
                    disabled={loading}
                    placeholder={`Type "${passphrase}"`}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="border-red-500 focus-visible:ring-red-500"
                />

                <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                    <Button
                        disabled={loading}
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={loading || !isMatch} // Button stays disabled until text matches
                        variant="destructive"
                        onClick={onConfirm}
                    >
                        Confirm & Execute
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default ConfirmActionModal