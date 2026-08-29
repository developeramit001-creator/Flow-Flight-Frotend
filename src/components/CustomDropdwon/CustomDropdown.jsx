'use client';

import {
    useState,
    useRef,
    useEffect,
    useCallback,
} from 'react';

import { createPortal } from 'react-dom';

import {
    motion,
    AnimatePresence,
} from 'framer-motion';

import {
    Check,
    ChevronDown,
} from 'lucide-react';

// ============================================
// CUSTOM DROPDOWN
//
// Reusable dropdown component.
//
// Features:
// - Portal based
// - Not clipped by overflow-hidden
// - Follows trigger while scrolling
// - Works with nested scroll containers
// - Opens top/bottom automatically
// - Outside click closes
// - Escape closes
// - Smooth animation
// ============================================

const CustomDropdown = ({
    value,
    onChange,
    options = [],
    placeholder = 'Select...',
    className = '',
    disabled = false,
}) => {
    const [isOpen, setIsOpen] =
        useState(false);

    const [mounted, setMounted] =
        useState(false);

    // ============================================
    // REFS
    // ============================================

    const containerRef =
        useRef(null);

    const dropdownRef =
        useRef(null);

    const animationFrameRef =
        useRef(null);

    // ============================================
    // POSITION STATE
    // ============================================

    const [position, setPosition] =
        useState({
            top: 0,
            left: 0,
            width: 0,
            placement: 'bottom',
        });

    // ============================================
    // SELECTED OPTION
    // ============================================

    const selectedOption =
        options.find(
            (option) =>
                option.value === value
        ) || null;

    // ============================================
    // MOUNT
    // ============================================

    useEffect(() => {
        setMounted(true);

        return () => {
            setMounted(false);
        };
    }, []);

    // ============================================
    // CANCEL RAF
    // ============================================

    const cancelPositionFrame =
        useCallback(() => {
            if (
                animationFrameRef.current !==
                null
            ) {
                cancelAnimationFrame(
                    animationFrameRef.current
                );

                animationFrameRef.current =
                    null;
            }
        }, []);

    // ============================================
    // GET DROPDOWN HEIGHT
    // ============================================

    const getDropdownHeight =
        useCallback(() => {
            // If dropdown is already rendered,
            // use its actual height.

            if (dropdownRef.current) {
                const rect =
                    dropdownRef.current.getBoundingClientRect();

                if (rect.height > 0) {
                    return rect.height;
                }
            }

            // Fallback estimation

            const itemHeight = 46;

            return Math.min(
                options.length *
                itemHeight +
                8,
                280
            );
        }, [options.length]);

    // ============================================
    // UPDATE POSITION
    //
    // preservePlacement = true
    //
    // During scroll we DON'T change from
    // bottom -> top or top -> bottom.
    //
    // This gives a much smoother experience.
    // ============================================

    const updatePosition =
        useCallback(
            (
                preservePlacement = false
            ) => {
                if (
                    !containerRef.current
                ) {
                    return;
                }

                const triggerRect =
                    containerRef.current.getBoundingClientRect();

                const viewportWidth =
                    window.innerWidth;

                // ========================================
                // DROPDOWN HEIGHT
                // ========================================

                const dropdownHeight =
                    getDropdownHeight();

                const gap = 6;

                // ========================================
                // DETERMINE PLACEMENT
                // ========================================

                let placement =
                    position.placement;

                if (!preservePlacement) {
                    const spaceBelow =
                        window.innerHeight -
                        triggerRect.bottom;

                    const spaceAbove =
                        triggerRect.top;

                    placement =
                        spaceBelow <
                            dropdownHeight +
                            gap &&
                            spaceAbove >
                            dropdownHeight
                            ? 'top'
                            : 'bottom';
                }

                // ========================================
                // VERTICAL POSITION
                //
                // IMPORTANT:
                //
                // NO viewport clamping.
                //
                // This allows dropdown to move
                // exactly with its trigger.
                // ========================================

                let top;

                if (
                    placement === 'top'
                ) {
                    top =
                        triggerRect.top -
                        dropdownHeight -
                        gap;
                } else {
                    top =
                        triggerRect.bottom +
                        gap;
                }

                // ========================================
                // HORIZONTAL POSITION
                // ========================================

                const width =
                    triggerRect.width;

                let left =
                    triggerRect.left;

                // Keep horizontally inside viewport

                if (
                    left + width >
                    viewportWidth - 8
                ) {
                    left =
                        viewportWidth -
                        width -
                        8;
                }

                if (left < 8) {
                    left = 8;
                }

                // ========================================
                // SET POSITION
                // ========================================

                setPosition({
                    top,
                    left,
                    width,
                    placement,
                });
            },
            [
                getDropdownHeight,
                position.placement,
            ]
        );

    // ============================================
    // SCHEDULE POSITION UPDATE
    // ============================================

    const schedulePositionUpdate =
        useCallback(
            (
                preservePlacement = true
            ) => {
                if (
                    animationFrameRef.current !==
                    null
                ) {
                    return;
                }

                animationFrameRef.current =
                    requestAnimationFrame(
                        () => {
                            animationFrameRef.current =
                                null;

                            updatePosition(
                                preservePlacement
                            );
                        }
                    );
            },
            [updatePosition]
        );

    // ============================================
    // INITIAL OPEN POSITION
    // ============================================

    useEffect(() => {
        if (!isOpen) {
            cancelPositionFrame();
            return;
        }

        /*
         * First calculate after dropdown
         * becomes visible.
         */

        requestAnimationFrame(() => {
            updatePosition(false);

            /*
             * Second calculation after the
             * portal has rendered.
             *
             * This gives us the actual
             * dropdown height.
             */

            requestAnimationFrame(() => {
                updatePosition(false);
            });
        });

        // ========================================
        // SCROLL
        // ========================================

        const handleScroll = (event) => {
            /*
             * If user scrolls INSIDE dropdown,
             * don't reposition the dropdown.
             *
             * Only the options list should scroll.
             */

            if (
                dropdownRef.current &&
                dropdownRef.current.contains(
                    event.target
                )
            ) {
                return;
            }

            /*
             * IMPORTANT:
             *
             * Don't close dropdown.
             *
             * Recalculate trigger position.
             */

            schedulePositionUpdate(true);
        };

        // ========================================
        // RESIZE
        // ========================================

        const handleResize = () => {
            /*
             * On resize we allow placement
             * to change if required.
             */

            schedulePositionUpdate(false);
        };

        /*
         * Capture = true
         *
         * This catches:
         * - window scroll
         * - page scroll
         * - dashboard scroll
         * - parent scroll
         * - nested scroll containers
         */

        window.addEventListener(
            'scroll',
            handleScroll,
            true
        );

        window.addEventListener(
            'resize',
            handleResize
        );

        return () => {
            window.removeEventListener(
                'scroll',
                handleScroll,
                true
            );

            window.removeEventListener(
                'resize',
                handleResize
            );

            cancelPositionFrame();
        };
    }, [
        isOpen,
        updatePosition,
        schedulePositionUpdate,
        cancelPositionFrame,
    ]);

    // ============================================
    // OUTSIDE CLICK
    // ============================================

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleMouseDown = (
            event
        ) => {
            const clickedTrigger =
                containerRef.current?.contains(
                    event.target
                );

            const clickedDropdown =
                dropdownRef.current?.contains(
                    event.target
                );

            if (
                !clickedTrigger &&
                !clickedDropdown
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener(
            'mousedown',
            handleMouseDown
        );

        return () => {
            document.removeEventListener(
                'mousedown',
                handleMouseDown
            );
        };
    }, [isOpen]);

    // ============================================
    // ESCAPE
    // ============================================

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (
            event
        ) => {
            if (
                event.key === 'Escape'
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener(
            'keydown',
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                'keydown',
                handleKeyDown
            );
        };
    }, [isOpen]);

    // ============================================
    // TOGGLE
    // ============================================

    const toggleDropdown = () => {
        if (
            disabled ||
            options.length === 0
        ) {
            return;
        }

        setIsOpen(
            (previous) => !previous
        );
    };

    // ============================================
    // DROPDOWN CONTENT
    // ============================================

    const dropdownContent =
        mounted &&
            isOpen &&
            options.length > 0
            ? createPortal(
                <AnimatePresence>
                    <motion.div
                        ref={dropdownRef}
                        initial={{
                            opacity: 0,
                            y:
                                position.placement ===
                                    'top'
                                    ? 8
                                    : -8,
                            scale: 0.97,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y:
                                position.placement ===
                                    'top'
                                    ? 8
                                    : -8,
                            scale: 0.97,
                        }}
                        transition={{
                            duration: 0.15,
                            ease: 'easeOut',
                        }}
                        style={{
                            position: 'fixed',

                            top: `${position.top}px`,

                            left: `${position.left}px`,

                            width: `${position.width}px`,

                            minWidth: '200px',

                            zIndex: 999999,
                        }}
                        className="
                              bg-white
                              dark:bg-gray-900
                              rounded-xl
                              border
                              border-gray-200
                              dark:border-gray-700
                              shadow-2xl
                              overflow-hidden
                          "
                    >
                        {/* ====================================
                              OPTIONS SCROLL AREA
                          ==================================== */}

                        <div
                            className="
                                  max-h-[280px]
                                  overflow-y-auto
                                  py-1
                              "
                        >
                            {options.map(
                                (
                                    option
                                ) => {
                                    const isSelected =
                                        option.value ===
                                        value;

                                    return (
                                        <button
                                            key={
                                                option.value
                                            }
                                            type="button"
                                            onClick={() => {
                                                onChange(
                                                    option.value
                                                );

                                                setIsOpen(
                                                    false
                                                );
                                            }}
                                            className={`
                                                  w-full
                                                  px-4
                                                  py-2.5
                                                  text-sm
                                                  text-left
                                                  flex
                                                  items-center
                                                  gap-2.5
                                                  transition-colors
                                                  duration-150
                                                  cursor-pointer

                                                  ${isSelected
                                                    ? `
                                                              bg-indigo-50
                                                              dark:bg-indigo-950/40
                                                              text-indigo-600
                                                              dark:text-indigo-400
                                                              font-medium
                                                            `
                                                    : `
                                                              text-gray-700
                                                              dark:text-gray-300
                                                              hover:bg-gray-50
                                                              dark:hover:bg-gray-800
                                                            `
                                                }
                                              `}
                                        >
                                            {/* ICON */}

                                            <span
                                                className="
                                                      text-base
                                                      flex-shrink-0
                                                      w-5
                                                      text-center
                                                  "
                                            >
                                                {
                                                    option.icon
                                                }
                                            </span>

                                            {/* LABEL */}

                                            <span
                                                className="
                                                      truncate
                                                      flex-1
                                                  "
                                            >
                                                {
                                                    option.label
                                                }
                                            </span>

                                            {/* CHECK */}

                                            {isSelected && (
                                                <Check
                                                    className="
                                                          w-4
                                                          h-4
                                                          text-indigo-500
                                                          flex-shrink-0
                                                      "
                                                />
                                            )}
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>,
                document.body
            )
            : null;

    // ============================================
    // RENDER
    // ============================================

    return (
        <>
            <div
                ref={containerRef}
                className={`relative ${className}`}
            >
                <button
                    type="button"
                    disabled={disabled}
                    onClick={
                        toggleDropdown
                    }
                    className={`
                        w-full
                        flex
                        items-center
                        justify-between
                        px-4
                        py-2.5
                        rounded-xl
                        border
                        transition-all
                        duration-200
                        bg-white
                        dark:bg-gray-800

                        ${disabled
                            ? `
                                    opacity-50
                                    cursor-not-allowed
                                  `
                            : `
                                    cursor-pointer
                                  `
                        }

                        ${isOpen
                            ? `
                                    border-indigo-500
                                    ring-2
                                    ring-indigo-500/20
                                  `
                            : `
                                    border-gray-300
                                    dark:border-gray-600
                                    hover:border-indigo-300
                                    dark:hover:border-indigo-600
                                  `
                        }
                    `}
                >
                    {/* ====================================
                        SELECTED VALUE
                    ==================================== */}

                    <span
                        className="
                            flex
                            items-center
                            gap-2
                            min-w-0
                        "
                    >
                        <span
                            className="
                                text-base
                                flex-shrink-0
                            "
                        >
                            {selectedOption?.icon ||
                                '🔗'}
                        </span>

                        <span
                            className={`
                                text-sm
                                truncate

                                ${selectedOption
                                    ? `
                                            text-gray-900
                                            dark:text-white
                                          `
                                    : `
                                            text-gray-400
                                            dark:text-gray-500
                                          `
                                }
                            `}
                        >
                            {selectedOption
                                ? selectedOption.label
                                : placeholder}
                        </span>
                    </span>

                    {/* ====================================
                        ARROW
                    ==================================== */}

                    <ChevronDown
                        className={`
                            w-4
                            h-4
                            flex-shrink-0
                            ml-2
                            text-gray-400
                            transition-transform
                            duration-200

                            ${isOpen
                                ? 'rotate-180'
                                : ''
                            }
                        `}
                    />
                </button>
            </div>

            {/* ========================================
                PORTAL DROPDOWN
            ======================================== */}

            {dropdownContent}
        </>
    );
};

export default CustomDropdown;
