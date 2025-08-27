import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { History } from "../../components/History";
import { styleDropDownOptions } from "../../constants/common";
import type { Generation } from "../../types";

describe("History Component", () => {
  const mockOnSelectItem = vi.fn();
  const mockOnClearHistory = vi.fn();

  const sampleHistory: Generation[] = [
    {
      id: "1",
      prompt: "A scenic mountain landscape",
      style: styleDropDownOptions[0]?.value ?? "realistic",
      imageUrl: "https://example.com/image1.jpg",
      createdAt: new Date("2023-08-01T10:00:00Z").toISOString(),
    },
    {
      id: "2",
      prompt: "Futuristic city skyline with neon lights",
      style: "custom-style",
      imageUrl: "https://example.com/image2.jpg",
      createdAt: new Date("2023-08-02T12:00:00Z").toISOString(),
    },
  ];

  it("renders empty state when no history", () => {
    render(
      <History
        history={[]}
        onSelectItem={mockOnSelectItem}
        onClearHistory={mockOnClearHistory}
      />
    );

    expect(screen.getByText("No generations yet")).toBeInTheDocument();
    expect(
      screen.getByText("Your recent generations will appear here")
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /clear history/i })
    ).not.toBeInTheDocument();
  });

  it("renders history items with correct content", () => {
    render(
      <History
        history={sampleHistory}
        onSelectItem={mockOnSelectItem}
        onClearHistory={mockOnClearHistory}
      />
    );

    // Heading
    expect(screen.getByText("Recent Generations")).toBeInTheDocument();

    // Items
    expect(
      screen.getByRole("button", {
        name: /select generation: A scenic mountain landscape/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /select generation: Futuristic city skyline/i,
      })
    ).toBeInTheDocument();

    // Images
    const images = document.querySelectorAll("img");
    expect(images).toHaveLength(2);
    

    // Style label from constants
    expect(
      screen.getByText(
        styleDropDownOptions[0]?.label ?? sampleHistory[0].style
      )
    ).toBeInTheDocument();

    // Custom style label fallback
    expect(screen.getByText("custom-style")).toBeInTheDocument();

    // Dates (formatted)
    expect(
      screen.getByText(new Date(sampleHistory[0].createdAt).toLocaleString())
    ).toBeInTheDocument();
    expect(
      screen.getByText(new Date(sampleHistory[1].createdAt).toLocaleString())
    ).toBeInTheDocument();
  });

  it("calls onClearHistory when clear button clicked", () => {
    render(
      <History
        history={sampleHistory}
        onSelectItem={mockOnSelectItem}
        onClearHistory={mockOnClearHistory}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /clear history/i }));
    expect(mockOnClearHistory).toHaveBeenCalledTimes(1);
  });

  it("calls onSelectItem with correct item when clicked", () => {
    render(
      <History
        history={sampleHistory}
        onSelectItem={mockOnSelectItem}
        onClearHistory={mockOnClearHistory}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /select generation: A scenic mountain landscape/i,
      })
    );
    expect(mockOnSelectItem).toHaveBeenCalledTimes(1);
    expect(mockOnSelectItem).toHaveBeenCalledWith(sampleHistory[0]);
  });
});
