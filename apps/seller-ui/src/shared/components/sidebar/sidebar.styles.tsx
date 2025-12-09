"use client";
import styled from "styled-components";

// SidebarWrapper Component
export const SidebarWrapper = styled.div`
  background-color: #114455;
  transition: all 0.3s ease;
  transform: translateX(-100%);
  position: fixed;
  z-index: 100;
  width: 16rem;
  height: 100%;
  overflow-y: auto;
  color: #fff;
  border-right: 1px solid #222;
  flex-direction: column;
  padding-top: 2rem;
  padding-bottom: 2rem;
  padding-left: 1rem;
  padding-right: 1rem;

  ::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    display: flex;
    position: static;
    width: auto;
    height: 100vh;
    overflow-y: visible;
    border-right: none;
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    transform: translateX(0);
  }

  // variants for collapsed state
  ${(props: any) =>
    props.collapsed &&
    `
      display: inherit;
      margin-left: 0;
      transform: translateX(0);
  `}
`;
// Ovetlay component
export const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  transition: opacity 0.3s ease;
  opacity: 0.8;

  @media (max-width: 768px) {
    display: none;
    z-index: auto;
    opacity: 1;
  }
`;

// Hewder Component
export const Header = styled.div`
  display: flex;
  align-items: center;
  padding-left: 0rem;
  padding-right: 0rem;
`;

// Body Component
export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
  padding-left: 0;
  padding-right: 0;
`;

// Footer Component
export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 4rem;
  padding-top: 4rem;

  @media (max-width: 768px) {

    padding-bottom: 0;
    padding-top: 0;
  }
`;

export const Sidebar = {
  Wrapper: SidebarWrapper,
  Overlay: Overlay,
  Header: Header,
  Body: Body,
  Footer: Footer,
}