import { MenuEditorModule } from './menu-editor.module';

describe('MenuEditorModule', () => {
  let menuEditorModule: MenuEditorModule;

  beforeEach(() => {
    menuEditorModule = new MenuEditorModule();
  });

  it('should create an instance', () => {
    expect(menuEditorModule).toBeTruthy();
  });
});
