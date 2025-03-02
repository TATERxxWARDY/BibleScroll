"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Sun, Moon, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { cn } from "@/lib/utils"

// Zoom levels
const ZOOM_LEVELS = {
  VERSE: 0,
  CHAPTER: 1,
  BOOK: 2,
  TESTAMENT: 3,
  BIBLE: 4,
}

export default function BibleScroll() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(ZOOM_LEVELS.CHAPTER)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Toggle dark mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Zoom in (more detail)
  const zoomIn = () => {
    if (zoomLevel > ZOOM_LEVELS.VERSE) {
      setZoomLevel(zoomLevel - 1)
    }
  }

  // Zoom out (less detail)
  const zoomOut = () => {
    if (zoomLevel < ZOOM_LEVELS.BIBLE) {
      setZoomLevel(zoomLevel + 1)
    }
  }

  // Handle mouse down for scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScrolling(true)
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft)
    setScrollLeft(scrollContainerRef.current!.scrollLeft)
  }

  // Handle touch start for mobile scrolling
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsScrolling(true)
    setStartX(e.touches[0].pageX - scrollContainerRef.current!.offsetLeft)
    setScrollLeft(scrollContainerRef.current!.scrollLeft)
  }

  // Handle mouse move for scrolling
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isScrolling) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current!.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed multiplier
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk
  }

  // Handle touch move for mobile scrolling
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isScrolling) return
    const x = e.touches[0].pageX - scrollContainerRef.current!.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed multiplier
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk
  }

  // Handle mouse up to stop scrolling
  const handleMouseUpOrLeave = () => {
    setIsScrolling(false)
  }

  // Get zoom level label
  const getZoomLevelLabel = () => {
    switch (zoomLevel) {
      case ZOOM_LEVELS.VERSE:
        return "Verse View"
      case ZOOM_LEVELS.CHAPTER:
        return "Chapter View"
      case ZOOM_LEVELS.BOOK:
        return "Book View"
      case ZOOM_LEVELS.TESTAMENT:
        return "Testament View"
      case ZOOM_LEVELS.BIBLE:
        return "Full Bible View"
      default:
        return "Chapter View"
    }
  }

  // Generate Bible content based on zoom level
  const getBibleContent = () => {
    // This would be replaced with actual Bible content from an API or database
    switch (zoomLevel) {
      case ZOOM_LEVELS.VERSE:
        return generateVerseView()
      case ZOOM_LEVELS.CHAPTER:
        return generateChapterView()
      case ZOOM_LEVELS.BOOK:
        return generateBookView()
      case ZOOM_LEVELS.TESTAMENT:
        return generateTestamentView()
      case ZOOM_LEVELS.BIBLE:
        return generateBibleView()
      default:
        return generateChapterView()
    }
  }

  // Generate verse view (most detailed)
  const generateVerseView = () => {
    return Array(20)
      .fill(0)
      .map((_, i) => (
        <div key={`verse-${i}`} className="min-w-[300px] p-6 border-r border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold mb-2">Verse {i + 1}</h3>
          <p className="text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl
            nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
          </p>
        </div>
      ))
  }

  // Generate chapter view
  const generateChapterView = () => {
    return Array(10)
      .fill(0)
      .map((_, i) => (
        <div key={`chapter-${i}`} className="min-w-[500px] p-6 border-r border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold mb-4">Chapter {i + 1}</h2>
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, j) => (
                <div key={`chapter-${i}-verse-${j}`} className="mb-2">
                  <span className="text-sm font-semibold mr-2">{j + 1}</span>
                  <span>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies
                    tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
                  </span>
                </div>
              ))}
          </div>
        </div>
      ))
  }

  // Generate book view
  const generateBookView = () => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <div key={`book-${i}`} className="min-w-[800px] p-6 border-r border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold mb-6">Book {i + 1}</h1>
          <div className="grid grid-cols-2 gap-4">
            {Array(4)
              .fill(0)
              .map((_, j) => (
                <div key={`book-${i}-chapter-${j}`} className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Chapter {j + 1}</h2>
                  <div className="text-sm opacity-80">
                    {Array(3)
                      .fill(0)
                      .map((_, k) => (
                        <p key={`book-${i}-chapter-${j}-summary-${k}`} className="mb-1">
                          {k + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                        </p>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))
  }

  // Generate testament view
  const generateTestamentView = () => {
    return Array(2)
      .fill(0)
      .map((_, i) => (
        <div key={`testament-${i}`} className="min-w-[1200px] p-6 border-r border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold mb-8">{i === 0 ? "Old Testament" : "New Testament"}</h1>
          <div className="grid grid-cols-3 gap-6">
            {Array(i === 0 ? 9 : 6)
              .fill(0)
              .map((_, j) => (
                <div key={`testament-${i}-book-${j}`} className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Book {j + 1}</h2>
                  <div className="text-sm opacity-80">
                    <p className="mb-1">Chapters: {Math.floor(Math.random() * 30) + 10}</p>
                    <p className="mb-1">Verses: {Math.floor(Math.random() * 800) + 200}</p>
                    <p className="mb-1">Key themes: Lorem ipsum, dolor sit amet</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))
  }

  // Generate bible view (least detailed)
  const generateBibleView = () => {
    return (
      <div className="min-w-[2400px] p-8 border-r border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-bold mb-10 text-center">The Holy Bible</h1>
        <div className="grid grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-6">Old Testament</h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              {Array(39)
                .fill(0)
                .map((_, i) => (
                  <div key={`ot-book-${i}`} className="p-2 border border-gray-200 dark:border-gray-700 rounded">
                    Book {i + 1}
                  </div>
                ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">New Testament</h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              {Array(27)
                .fill(0)
                .map((_, i) => (
                  <div key={`nt-book-${i}`} className="p-2 border border-gray-200 dark:border-gray-700 rounded">
                    Book {i + 1}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("h-screen w-full flex flex-col", isDarkMode ? "dark" : "")}>
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300 h-full flex flex-col">
        {/* Header with theme toggle */}
        <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold">Bible Scroll Viewer</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm">{getZoomLevelLabel()}</span>
            <Toggle pressed={isDarkMode} onPressedChange={toggleTheme} aria-label="Toggle theme" className="ml-2">
              {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Toggle>
          </div>
        </header>

        {/* Main scroll container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto flex items-stretch cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUpOrLeave}
        >
          <div className="flex h-full">{getBibleContent()}</div>
        </div>

        {/* Zoom controls */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={zoomIn}
            disabled={zoomLevel <= ZOOM_LEVELS.VERSE}
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={zoomOut}
            disabled={zoomLevel >= ZOOM_LEVELS.BIBLE}
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

