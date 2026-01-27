"use client"

import {
    EditorContent,
    useEditor,
} from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import { Bold, Code2Icon, Italic, ListTodoIcon, LucideIcon, MessageSquarePlusIcon, Redo2Icon, RemoveFormattingIcon, SpellCheckIcon, UnderlineIcon, Undo2Icon } from "lucide-react"
import Image from '@tiptap/extension-image'
import ImageResize from 'tiptap-extension-resize-image'
import { FontSize, TextStyle } from "@tiptap/extension-text-style"

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuTrigger,
    ContextMenuSeparator,
} from "@/components/ui/context-menu"
import { ToolbarButton } from "./tools/ToolbarButton"
import { useEditorStore } from "@/store/use-editor-store"
import { ListButton } from "./tools/Listbutton"
import { FontSizeButton } from "./tools/FontSizeButton"
import { ImageButton } from "./tools/ImageButton"

interface BlogEditorProps {
    value: string
    onChange: (value: string) => void
}

const BlogEditor = ({ value, onChange }: BlogEditorProps) => {
    const {
        setEditor,
    } = useEditorStore();

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            TextStyle,
            FontSize,
            Image,
            ImageResize,
        ],
        content: value,
        onUpdate({ editor }) {
            setEditor(editor)
        },
        onCreate({ editor }) {
            setEditor(editor)
        },
        onSelectionUpdate({ editor }) {
            setEditor(editor)
        },
        onTransaction({ editor }) {
            setEditor(editor)
        },
        onFocus({ editor }) {
            setEditor(editor)
        },
        onBlur({ editor }) {
            setEditor(editor)
        },
        onContentError({ editor }) {
            setEditor(editor)
        },
        onDestroy() {
            setEditor(null)
        },
        editorProps: {
            attributes: {
                class:
                    "prose max-w-none min-h-[40dvh] p-4 focus:outline-none",
            },
        },
    })


    if (!editor) return null

    const section: {
        lable: string
        icon: LucideIcon;
        onClick?: () => void;
        isActive: boolean;
    }[][] = [
            [
                {
                    lable: 'Undo',
                    icon: Undo2Icon,
                    onClick: () => editor?.chain().focus().undo().run(),
                    isActive: false
                },
                {
                    lable: 'Redo',
                    icon: Redo2Icon,
                    onClick: () => editor?.chain().focus().redo().run(),
                    isActive: false
                },
                {
                    lable: 'Spell Check',
                    icon: SpellCheckIcon,
                    onClick: () => {
                        const current = editor?.view.dom.getAttribute('spellcheck');
                        editor?.view.dom.setAttribute('spellcheck', current === 'true' ? 'false' : 'true');
                    },
                    isActive: false
                },
            ],
            [
                {
                    lable: 'Bold',
                    icon: Bold,
                    onClick: () => {
                        editor?.chain().focus().toggleBold().run();
                    },
                    isActive: editor?.isActive('bold') ?? false,
                },
                {
                    lable: 'Italic',
                    icon: Italic,
                    onClick: () => {
                        editor?.chain().focus().toggleItalic().run();
                    },
                    isActive: editor?.isActive('italic') ?? false,
                },
                {
                    lable: 'Underline',
                    icon: UnderlineIcon,
                    onClick: () => {
                        editor?.chain().focus().toggleUnderline().run();
                    },
                    isActive: editor?.isActive('underline') ?? false,
                },
                {
                    lable: 'Code',
                    icon: Code2Icon,
                    onClick: () => {
                        editor?.chain().focus().toggleCode().run()
                    },
                    isActive: editor?.isActive('code') ?? false,
                }
            ],
            [
                {
                    lable: 'Remove Formating',
                    icon: RemoveFormattingIcon,
                    onClick: () => editor?.chain().focus().unsetAllMarks().run(),
                    isActive: false,
                },
            ],

        ];

    return (

        <div className="border rounded-md">
            <ContextMenu>
               
                <ContextMenuTrigger asChild>
                    <div>
                        <EditorContent editor={editor} />
                    </div>
                </ContextMenuTrigger>

                {/* Context menu */}
                <ContextMenuContent className="flex flex-col justify-center w-full gap-1 p-1">
                    
                    {section[1].map((item) => (
                        <ToolbarButton key={item.lable} {...item} />
                    ))}

                    <ContextMenuSeparator />

                    
                    {section[0].map((item) => (
                        <ToolbarButton key={item.lable} {...item} />
                    ))}

                    <ContextMenuSeparator />

                   
                    {section[2].map((item) => (
                        <ToolbarButton key={item.lable} {...item} />
                    ))}

                    <ContextMenuSeparator />

                    <ListButton />
                    <ContextMenuSeparator />
                    <FontSizeButton />
                    <ContextMenuSeparator />
                    <ImageButton />
                </ContextMenuContent>
            </ContextMenu>
        </div>

    )
}

export default BlogEditor
