export class UIManager {
  public static setUserInterfaceVisible(value: boolean): void {
    if (document.getElementById('ui-container'))
      document.getElementById('ui-container').style.display = value
        ? 'block'
        : 'none';
  }

  public static setFPSVisible(value: boolean): void {
    document.getElementById('statsBox').style.display = value
      ? 'block'
      : 'none';
    document.getElementById('dat-gui-container').style.top = value
      ? '48px'
      : '0px';
  }
}
