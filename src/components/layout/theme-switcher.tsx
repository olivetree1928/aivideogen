"use client";

import React from 'react';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useTheme } from '@/contexts/theme';

export default function ThemeSwitcher() {
  const { currentTheme, themeName, setTheme, availableThemes } = useTheme();

  const isDarkTheme = (name: string) => name === 'dark' || name.includes('dark');
  
  const lightThemes = Object.entries(availableThemes).filter(([name]) => !isDarkTheme(name));
  const darkThemes = Object.entries(availableThemes).filter(([name]) => isDarkTheme(name));

  const handleThemeChange = (key: string) => {
    console.log('Theme change requested:', key);
    console.log('Available themes:', availableThemes);
    console.log('Current theme name:', themeName);
    
    // 忽略分隔项
    if (key === 'light-themes' || key === 'dark-themes') {
      console.log('Ignoring separator item:', key);
      return;
    }
    
    setTheme(key);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button 
          variant="light"
          isIconOnly
          className="text-foreground"
          aria-label="Switch theme"
        >
          <Icon 
            icon={isDarkTheme(themeName) ? "lucide:moon" : "lucide:sun"} 
            width={20} 
            height={20} 
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        variant="faded"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={new Set([themeName])}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0] as string;
          handleThemeChange(selectedKey);
        }}
        className="max-w-xs"
      >
        <DropdownItem key="light-themes" className="opacity-50 cursor-default" textValue="Light Themes">
          <span className="text-xs font-semibold text-muted-foreground">Light Themes</span>
        </DropdownItem>
        {lightThemes.map(([key, theme]) => {
          return (
            <DropdownItem 
              key={key} 
              textValue={theme.name}
              startContent={
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                />
              }
            >
              {theme.name}
            </DropdownItem>
          );
        })}
        <DropdownItem key="dark-themes" className="opacity-50 cursor-default" textValue="Dark Themes">
          <span className="text-xs font-semibold text-muted-foreground">Dark Themes</span>
        </DropdownItem>
        {darkThemes.map(([key, theme]) => {
          return (
            <DropdownItem 
              key={key} 
              textValue={theme.name}
              startContent={
                <div 
                  className="w-4 h-4 rounded-full border border-gray-600"
                  style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                />
              }
            >
              {theme.name}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
}