import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { CaretDown, Check } from "@phosphor-icons/react";

interface ArchiveSelectProps {
  label: string;
  onChange: (value: string) => void;
  options: readonly string[];
  value: string;
}

interface ArchiveSelectOption {
  label: string;
  value: string;
}

export function getNextOptionIndex(
  currentIndex: number,
  optionCount: number,
  key: "ArrowDown" | "ArrowUp" | "End" | "Home",
) {
  if (optionCount <= 0) return -1;

  switch (key) {
    case "ArrowDown":
      return (currentIndex + 1 + optionCount) % optionCount;
    case "ArrowUp":
      return (currentIndex - 1 + optionCount) % optionCount;
    case "Home":
      return 0;
    case "End":
      return optionCount - 1;
  }
}

export function ArchiveSelect({
  label,
  onChange,
  options,
  value,
}: ArchiveSelectProps) {
  const listboxId = useId();
  const labelId = useId();
  const valueId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const selectOptions = useMemo<ArchiveSelectOption[]>(
    () => [
      { label: `All ${label.toLocaleLowerCase("en")}`, value: "" },
      ...options.map((option) => ({ label: option, value: option })),
    ],
    [label, options],
  );
  const selectedIndex = Math.max(
    0,
    selectOptions.findIndex((option) => option.value === value),
  );
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const selectedOption = selectOptions[selectedIndex];

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, isOpen]);

  const open = () => {
    setActiveIndex(selectedIndex);
    setIsOpen(true);
  };

  const close = (restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  const select = (option: ArchiveSelectOption) => {
    onChange(option.value);
    close(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "Home" ||
      event.key === "End"
    ) {
      event.preventDefault();
      if (!isOpen) {
        open();
        return;
      }

      setActiveIndex((currentIndex) =>
        getNextOptionIndex(
          currentIndex,
          selectOptions.length,
          event.key as "ArrowDown" | "ArrowUp" | "End" | "Home",
        ),
      );
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!isOpen) {
        open();
      } else {
        select(selectOptions[activeIndex]);
      }
      return;
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      close(true);
    } else if (event.key === "Tab") {
      close();
    }
  };

  return (
    <div
      className="archive-field archive-field--select"
      data-open={isOpen || undefined}
      ref={rootRef}
    >
      <span className="archive-field__label" id={labelId}>
        {label}
      </span>
      <div className="archive-select">
        <button
          aria-activedescendant={
            isOpen ? `${listboxId}-option-${activeIndex}` : undefined
          }
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={`${labelId} ${valueId}`}
          className="archive-select__trigger"
          onClick={() => (isOpen ? close() : open())}
          onKeyDown={handleKeyDown}
          ref={triggerRef}
          role="combobox"
          type="button"
        >
          <span id={valueId}>{selectedOption.label}</span>
          <CaretDown size={14} weight="bold" aria-hidden="true" />
        </button>

        {isOpen ? (
          <div
            aria-labelledby={labelId}
            className="archive-select__menu"
            id={listboxId}
            role="listbox"
          >
            {selectOptions.map((option, index) => {
              const isSelected = option.value === value;

              return (
                <button
                  aria-selected={isSelected}
                  className="archive-select__option"
                  data-active={index === activeIndex || undefined}
                  id={`${listboxId}-option-${index}`}
                  key={option.value}
                  onClick={() => select(option)}
                  onMouseEnter={() => setActiveIndex(index)}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  role="option"
                  tabIndex={-1}
                  type="button"
                >
                  <span className="archive-select__check" aria-hidden="true">
                    {isSelected ? <Check size={14} weight="bold" /> : null}
                  </span>
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
